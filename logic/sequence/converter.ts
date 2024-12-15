import { PAGE_HEIGHT, PAGE_WIDTH, type DIOMxCell, type DIOMxfile } from "~/models/DrawIOXML";
import {
    isSequenceActivation,
    isSequenceBlock,
    isSequenceMessage,
    type Block,
    type Message,
    type SequenceDiagramData,
    type SequenceElement,
} from "~/models/SequenceDiagramData";
import makeMXFile from "./makeMXFile";
import makeMXDiagram from "./makeMXDiagram";
import makeMXGraphModel from "./makeMXGraphModel";
import makeMXCell from "./makeMXCell";
import createActor from "./createActor";
import setBounds from "../setBounds";
import createActivation from "./createActivation";
import createMessage from "./createMessage";
import getBounds from "../getBounds";
import createBlock from "./createBlock";
import createSelfMessage from "./createSelfMessage";
import getTextDimensions from "~/utils/getTextDimensions";

export const ACTOR_BOX_HEIGHT = 40;
export const NESTED_BLOCK_PADD = 20;
export const SELF_MESSAGE_HEIGHT = 70;
export const SELF_MESSAGE_GAP = 20;

//#region Convert Utility
export class ConvertUtil {
    static id: number = 1;
    static y: number = 10;

    static get new_id(): number {
        return ++this.id;
    }

    static new_y(type: "message" | "block" | "self-message" = "message"): number {
        const lasty = this.y;

        switch (type) {
            case "block":
                this.y += 20;
                break;
            case "message":
                this.y += 40;
                break;
            case "self-message":
                this.y += SELF_MESSAGE_HEIGHT + 10;
                break;
        }

        return lasty;
    }

    static yfrom(s: SequenceElement) {
        const lasty = ConvertUtil.y;

        if (isSequenceMessage(s)) {
            ConvertUtil.new_y(s.receiver === s.sender ? "self-message" : "message");
        } else if (isSequenceBlock(s)) {
            ConvertUtil.new_y("block");
            if (s.type === "block") ConvertUtil.new_y("block");
        }

        return lasty;
    }

    static reset() {
        // reset the id to 1 (since id of 1 is the root parent)
        this.id = 1;
        this.y = ACTOR_BOX_HEIGHT + 10;
    }

    static resety() {}
}

//#region Traversals

export const traversebf = (
    data: SequenceDiagramData["elements"],
    cb: (element: SequenceElement, index: number, depth: number) => void,
    direction: "ltr" | "rtl" = "ltr"
) => {
    const queue = direction === "ltr" ? data.slice(0) : data.slice(0).reverse();
    let depth = 0;
    let depthcounter = queue.length;

    let index = 0;

    while (queue.length > 0) {
        const item = queue.shift();
        if (!item) break;

        depthcounter--;
        if (depthcounter === 0) {
            depthcounter = queue.length;
            depth++;
        }

        if ("elements" in item)
            queue.push(...(direction === "ltr" ? item.elements : item.elements.slice(0).reverse()));
        cb(item, index++, depth);
    }
};

export const traversedf = (
    data: SequenceDiagramData["elements"],
    cb: (element: SequenceElement, index: number, depth: number) => void,
    direction: "ltr" | "rtl" = "ltr"
) => {
    const stack = direction === "ltr" ? data.slice(0).reverse() : data.slice(0);
    const depthrecord = [stack.length];

    let index = 0;
    while (stack.length > 0) {
        const item = stack.pop();
        if (!item) break;

        // Get depth
        const depth = depthrecord.findLastIndex((n) => n > 0);
        depthrecord[depth]!--;

        if ("elements" in item) {
            const elements =
                direction === "ltr" ? item.elements.slice(0).reverse() : item.elements.slice(0);
            stack.push(...elements);
            depthrecord[depth + 1] = (depthrecord[depth + 1] || 0) + elements.length;
        }

        cb(item, index++, depth);
    }
};

//#region Converter

export const convert = (
    data: Pick<SequenceDiagramData, "actors" | "elements" | "title">
): { elements: DIOMxfile[] } => {
    ConvertUtil.reset();

    const file = makeMXFile({ etag: uuid(20) });
    const diag = makeMXDiagram({
        name: "Sequence Diagram",
        id: "1JH53qiQk0_ZUpMnK-7I",
    });
    const graphmodel = makeMXGraphModel({
        pageWidth: PAGE_WIDTH,
        pageHeight: PAGE_HEIGHT,
    });
    file.elements.push(diag);
    diag.elements.push(graphmodel);

    const [root] = graphmodel.elements;
    const { elements } = root;

    const _ = makeMXCell({ id: 0 });
    const rootcell = makeMXCell({ id: 1, parent: 0 });

    //#region Preparation
    const pad_top_indexes: number[] = [];
    const messages: Message[] = [];
    const _lifeline_records: Record<string, [number, number]> = {};

    traversedf(data.elements, (item, i) => {
        while (pad_top_indexes.includes(i)) {
            const index = pad_top_indexes.indexOf(i);
            pad_top_indexes.splice(index, 1);
        }
        if (isSequenceMessage(item)) {
            messages.push(item);

            // Record Activation
            const y = ConvertUtil.yfrom(item);

            if (_lifeline_records[item.sender]) {
                _lifeline_records[item.sender]![1] = y;
            } else {
                _lifeline_records[item.sender] = [y, y];
            }

            if (_lifeline_records[item.receiver]) {
                _lifeline_records[item.receiver]![1] = y;
            } else {
                _lifeline_records[item.receiver] = [y, y];
            }
        } else if (isSequenceBlock(item)) {
            ConvertUtil.yfrom(item);

            if (item.type !== "block") {
                let index = i + 1;
                traversedf(item.elements, (item, ind, d) => (index = ind + i + 2));
                pad_top_indexes.push(index);
            }
        }
    });
    const max_height = ConvertUtil.y;

    ConvertUtil.reset();

    const longestmessagewidth = Math.max(
        getTextDimensions(
            messages.reduce(
                (max, msg) => (max.length > msg.content.length ? max : msg.content),
                "" as string
            ),
            12
        ).width,
        300
    );

    //#region Initialize the actors
    const actor_record: Record<string, { actor: DIOMxCell; lifeline: DIOMxCell }> = {};
    const actor_record_id: Record<number, { actor: DIOMxCell; lifeline: DIOMxCell }> = {};
    const actor_cells: DIOMxCell[] = [];
    const lifeline_cells: DIOMxCell[] = [];

    data.actors.forEach((actor, i) => {
        const actor_cell = createActor({
            value: actor,
            index: i,
            box_height: ACTOR_BOX_HEIGHT,
        });
        setBounds(actor_cell, {
            x: i * longestmessagewidth,
            height: max_height,
        });

        actor_cells.push(actor_cell);

        // Create Lifelines
        const actor_id = actor_cell.attributes.id;

        const [start = -1, end = -1] = _lifeline_records[actor] || [];

        let lifeline_cell = makeMXCell({ id: -1 });
        if (start !== -1 && end !== -1) {
            lifeline_cell = createActivation({ actor_id, start, end });
            lifeline_cells.push(lifeline_cell);
        }

        actor_record[actor] = {
            actor: actor_cell,
            lifeline: lifeline_cell,
        };

        actor_record_id[actor_id] = {
            actor: actor_cell,
            lifeline: lifeline_cell,
        };
    });
    // Activation (Just activate all though out the diagram)

    //#region Process Elemeents
    pad_top_indexes.splice(0);
    const sequence_elements: DIOMxCell[] = [];
    traversedf(data.elements, (item, i, depth) => {
        while (pad_top_indexes.includes(i)) {
            const index = pad_top_indexes.indexOf(i);
            pad_top_indexes.splice(index, 1);
        }

        if (isSequenceMessage(item)) {
            //#region - Messages-
            const sender_record = actor_record[item.sender];
            const receiver_record = actor_record[item.receiver];

            if (!sender_record || !receiver_record) {
                console.warn(
                    `Message with a non-recorded items: ${item.sender} ${item.type === "async" && "-"}-> ${item.receiver}`
                );
                return;
            }

            const { lifeline: source_lifeline, actor: source_actor } = sender_record;
            const { lifeline: target_lifeline, actor: target_actor } = receiver_record;

            if (item.sender === item.receiver) {
                const [lifeline, msg] = createSelfMessage({
                    message: item,
                    lifeline: source_lifeline,
                    actor: source_actor,
                });

                item.cellid = msg.attributes.id;
                sequence_elements.push(lifeline, msg);
            } else {
                const msg = createMessage({
                    message: item,
                    source_lifeline,
                    target_lifeline,
                    source_actor,
                    target_actor,
                });

                item.cellid = msg.attributes.id;

                sequence_elements.push(msg);
            }
        } else if (isSequenceBlock(item)) {
            //#region - Blocks -

            // Pad Top the last index of the elements in this block
            if (item.type !== "block") {
                let index = i + 1;
                traversedf(item.elements, (item, ind, d) => (index = ind + i + 2));
                pad_top_indexes.push(index);
            }

            const block = createBlock({
                block: item,
                actor_cells,
                actor_record,
                elements: sequence_elements,
            });

            sequence_elements.push(block);

            item.cellid = block.attributes.id;

            // TODO: Set this block as the current_block for positioning and parent linking
        } else if (isSequenceActivation(item)) {
            //#region - Activations -
        } else {
        }
    });

    // Add elements
    elements.push(_, rootcell, ...actor_cells, ...lifeline_cells, ...sequence_elements);

    return {
        elements: [file],
    };
};
