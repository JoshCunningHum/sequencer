import { js2xml } from "xml-js";
import type { DIOMxCell } from "~/models/DrawIOXML";
import {
    isSequenceActivation,
    isSequenceBlock,
    isSequenceMessage,
    type Activation,
    type Block,
    type Message,
    type SequenceElement,
    type SequencePage,
} from "~/models/SequenceDiagramData";
import getBounds from "../getBounds";
import setBounds from "../setBounds";
import createActivation from "./createActivation";
import createActor from "./createActor";
import createMessage from "./createMessage";
import createSelfMessage from "./createSelfMessage";
import { ActorHelper } from "./helper/actor";
import makeMXCell from "./makeMXCell";
import makeMXDiagram from "./makeMXDiagram";
import makeMXFile from "./makeMXFile";
import makeMXGraphModel from "./makeMXGraphModel";
import { BlockHelper } from "./helper/block";
import createBlock from "./createBlock";
import { createDashed } from "./createDashed";
import { createLabel } from "./createLabel";

interface ConvertProps {
    data: SequencePage[];
    dev?: boolean;
}

//#region Diagram Constants
export const ACTOR_BOX_HEIGHT = 40;
export const ACTOR_PADDING = 20;
export const ACTOR_MIN_WIDTH = 60;
export const ACTOR_PAD_BOTTOM = 20;

export const HEIGHT_MESSAGE = 5;

export const HEIGHT_SELFMESSAGE = 60;
export const WIDTH_SELFMESSAGE = 35; // This must be bigger than lifeline width
export const OFFSET_SELFMESSAGE = 0;
export const SELF_MESSAGE_GAP = 20;

export const BLOCK_PAD_TOP = 10;
export const BLOCK_PAD_BOT = 5;
export const BLOCK_CONDITION_LEFTMARGIN = 70;
export const BLOCK_CONDITION_TOPMARGIN = 5;
export const BLOCK_LEVEL_PAD_LEFT = 17;
export const BLOCK_LEVEL_PAD_RIGHT = 10;
export const BLOCK_SELFMSG_EXPANSION = 60;
export const ITEMS_GAP = 20; // applied on everything

export const LIFELINE_WIDTH = 20;

export const PAGE_WIDTH = 850;
export const PAGE_HEIGHT = 1100;

export class PlantUMLConverter {
    dev?: boolean;

    //#region Internal Properties
    data: SequencePage;

    id: number = 1;
    get new_id() {
        return ++this.id;
    }

    // positioning
    y = ACTOR_BOX_HEIGHT + ITEMS_GAP;
    depth = 0;

    // helpers
    actors: ActorHelper = new ActorHelper([], 0);
    block: BlockHelper;

    new_y(type: "message" | "block" | "block-end" | "self-message" = "message"): number {
        const lasty = this.y;

        switch (type) {
            case "block":
                this.y += BLOCK_PAD_TOP;
                break;
            case "block-end":
                this.y += BLOCK_PAD_BOT;
                break;
            case "message":
                this.y += HEIGHT_MESSAGE;
                break;
            case "self-message":
                this.y += HEIGHT_SELFMESSAGE;
                break;
        }

        this.y += ITEMS_GAP;

        return lasty;
    }

    //#region Result Properties
    messages: Message[] = [];
    activations: Map<string, DIOMxCell> = new Map();
    elements: DIOMxCell[] = [];

    //#region Entry Point
    static Convert({ data, dev }: ConvertProps) {
        const file = makeMXFile({ etag: this.uuid(20) });
        const diags = data.map((page) => {
            const converter = new PlantUMLConverter(page);
            return converter.convert();
        });
        file.elements.push(...diags);
        return js2xml(
            {
                elements: [file],
            },
            {
                spaces: 2,
                compact: false,
            }
        );
    }

    //#region Debug Utils

    log(...params: any[]) {
        if (this.dev) console.log(...params);
    }

    warn(...params: any[]) {
        if (this.dev) console.warn(...params);
    }

    constructor(data: SequencePage, dev?: boolean) {
        this.data = data;
        this.dev = dev;

        this.block = new BlockHelper({
            genid: () => this.new_id,
            actors: this.actors,
        });
    }

    //#region Main Loop

    convert() {
        const page = this.data;

        const { diag, elements } = this.createBoilerPlate();

        const actor_gap = page.messages.reduce(
            (acc, msg) => Math.max(getTextDimensions(msg.content, 12).width, acc),
            0
        );

        this.actors = new ActorHelper(page.actors, actor_gap);
        this.block.actors = this.actors;

        this.placeActors();
        this.placeElements(page.elements); // recursive

        //#region Re-setting Heights
        this.actors.setHeights(this.y + ACTOR_PAD_BOTTOM);

        // Adding all the elements
        elements.push(...this.elements);

        return diag;
    }

    //#region Actors
    placeActors() {
        this.data.actors.forEach((actor, i) => {
            const { x, width, center, left, right } = this.actors.coord(actor)!;

            const name = `${actor.name}`;

            const cell = createActor({
                value: name,
                index: i,
                height: ACTOR_BOX_HEIGHT,
                id: this.new_id,
                width,
            });

            setBounds(cell, {
                x,
                height: ACTOR_BOX_HEIGHT, // To be changed later
            });

            this.actors.cells.set(actor.name, cell);
            this.add(cell);
        });
    }

    //#region Elements
    placeElements(data: SequenceElement[]) {
        data.forEach((item) => {
            if (isSequenceMessage(item)) this.placeMessage(item);
            else if (isSequenceActivation(item)) this.placeActivation(item);
            else if (isSequenceBlock(item)) this.placeBlock(item);
        });
    }

    //#region Message
    placeMessage(item: Message) {
        const [startX, endX] = this.actors.getBounds(item.sender, item.receiver) || [];

        if (!startX || !endX) {
            this.warn(`Creating a message with coords: (${startX}, ${endX})`);
            return;
        }

        const isSelfMessage = item.receiver === item.sender;
        const y = this.new_y(isSelfMessage ? "self-message" : "message");

        this.block.involves(item.sender);
        this.block.involves(item.receiver);

        if (isSelfMessage) {
            const actor_cell = this.actors.cells.get(item.sender)!;
            const [bar, msg] = createSelfMessage({
                message: item,
                actor: actor_cell,
                bar_id: this.new_id,
                msg_id: this.new_id,
                y,
            });
            // also expand if there inside a block
            this.block.expandForSelfMsg(item);
            this.add(bar, msg);
        } else {
            const content = `${item.content}`;

            const msg = createMessage({
                message: { ...item, content },
                endX,
                startX,
                y,
                id: this.new_id,
            });

            this.add(msg);
        }
    }

    //#region Activation
    placeActivation({ actor, type }: Activation) {
        const y = this.y - (HEIGHT_MESSAGE + ITEMS_GAP);
        const actor_id = this.actors.id(actor);
        const bounds = this.actors.coord(actor);

        if (!actor_id || !bounds) {
            this.warn(`Activating [${actor}] but cell not found`);
            return;
        }

        const { width: actor_width } = bounds;

        if (type === "start") {
            const cell = createActivation({
                id: this.new_id,
                actor_id,
                start: y,
                end: y + 100,
                width: LIFELINE_WIDTH,
                actor_width,
            });

            this.activations.set(actor, cell);
            this.add(cell);
        } else {
            // Find the stored reference to the activation
            const activation = this.activations.get(actor)!;
            const height = y - getBounds(activation).y!;
            setBounds(activation, { height });

            // Remove the activation
            this.activations.delete(actor);
        }
    }

    //#region Block
    placeBlock(item: Block) {
        const genid = () => this.new_id;
        const genY = () => this.new_y("block");

        if (item.type === "block") {
            const [condition = ""] = item.conditions;
            const parent = this.block.current;

            const is_first = item.conditions.length <= 1;

            if (!is_first && parent) {
                const y = genY();

                this.new_y("message");
                const cell = createDashed({
                    y,
                    id: this.new_id,
                    parent,
                    text: condition,
                });
                this.block.add(cell);
                this.add(cell);
            }

            this.placeElements(item.elements);
        } else {
            const cell = createBlock({ block: item, genid, genY });
            this.block.add(cell);
            this.add(cell);
            const { y: top = 0 } = getBounds(cell);

            // add base label
            if (item.conditions.length) {
                const condition = item.conditions[0]!;
                const label = createLabel({
                    id: this.new_id,
                    parent: cell,
                    text: condition,
                });
                this.add(label);
                this.new_y("message");
            }

            this.placeElements(item.elements);
            this.block.pop();

            // set the height after setting all of its child components
            setBounds(cell, {
                height: this.y - top,
            });

            this.new_y("block-end");
        }
    }

    //#region Utils

    add(...cells: DIOMxCell[]) {
        this.elements.push(...cells);
    }

    createBoilerPlate() {
        const diag = makeMXDiagram({
            name: this.data.name,
            id: uuid(20),
        });

        // Acts as a wrapper for the page details
        const graphmodel = makeMXGraphModel({
            pageWidth: PAGE_WIDTH,
            pageHeight: PAGE_HEIGHT,
        });

        diag.elements.push(graphmodel);

        // DrawIO boiler plate data
        const [root] = graphmodel.elements;
        const { elements } = root;

        const _ = makeMXCell({ id: 0 });
        const root_cell = makeMXCell({ id: 1, parent: 0 });
        this.add(_, root_cell);

        return {
            diag,
            graphmodel,
            root,
            elements,
        };
    }

    static uuid(length: number = 8): string {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    //#region Traversal Methods
    depth_first(
        data: SequenceElement[],
        cb: (element: SequenceElement, index: number, depth: number) => void,
        direction: "ltr" | "rtl" = "ltr"
    ) {
        const isL2R = direction === "ltr";

        const stack = isL2R ? data.slice(0).reverse() : data.slice(0);
        const depthrecord = [stack.length];

        let index = 0;
        while (stack.length > 0) {
            const item = stack.pop();
            if (!item) break;

            // Get depth
            const depth = depthrecord.findLastIndex((n) => n > 0);
            depthrecord[depth]!--;

            if ("elements" in item) {
                const elements = isL2R ? item.elements.slice(0).reverse() : item.elements;
                stack.push(...elements);
                depthrecord[depth + 1] = (depthrecord[depth + 1] || 0) + elements.length;
            }

            cb(item, index++, depth);
        }
    }
}
