import { PAGE_HEIGHT, PAGE_WIDTH, type DIOMxfile } from "~/models/DrawIOXML";
import type {
    Message,
    SequenceDiagramData,
    SequenceElement,
} from "~/models/SequenceDiagramData";
import makeMXFile from "./makeMXFile";
import makeMXDiagram from "./makeMXDiagram";
import makeMXGraphModel from "./makeMXGraphModel";
import makeMXCell from "./makeMXCell";
import createActor from "./createActor";
import setBounds from "../setBounds";
import etag from "etag";

//#region Convert Utility
export class ConvertUtil {
    static id: number = 1;
    static y: number = 10;

    static get new_id(): number {
        return ++this.id;
    }

    static new_y(
        type: "message" | "block" | "self-message" = "message"
    ): number {
        switch (type) {
            case "block":
                this.y += 20;
                break;
            case "message":
                this.y += 30;
                break;
            case "self-message":
                this.y += 50;
                break;
        }

        return this.y;
    }

    static reset() {
        // reset the id to 1 (since id of 1 is the root parent)
        this.id = 1;
        this.y = 10;
    }
}

//#region Traversals

const traversebf = (
    data: SequenceDiagramData["elements"],
    cb: (element: SequenceElement, index: number, depth: number) => void
) => {
    const queue = data.slice(0);
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

        if ("elements" in item) queue.push(...item.elements);
        cb(item, index++, depth);
    }
};

const traversedf = (
    data: SequenceDiagramData["elements"],
    cb: (element: SequenceElement, index: number, depth: number) => void
) => {
    const stack = data.slice(0).reverse();
    const depthrecord = [stack.length];

    let index = 0;
    while (stack.length > 0) {
        const item = data.pop();
        if (!item) break;

        // Get depth
        const depth = depthrecord.findLastIndex((n) => n > 0);
        depthrecord[depth]--;

        if ("elements" in item) {
            const elements = item.elements.slice(0).reverse();
            stack.push(...elements);
            depthrecord[depth + 1] =
                (depthrecord[depth + 1] || 0) + elements.length;
        }

        cb(item, index++, depth);
    }
};

//#region Converter

export const convert = (
    data: Pick<SequenceDiagramData, "actors" | "elements" | "title">
): { elements: DIOMxfile[] } => {
    ConvertUtil.reset();

    const file = makeMXFile({ etag: genid(20) });
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
    const messages: Message[] = [];
    traversedf(data.elements, (item) => {
        if ("content" in item) messages.push(item);
    });

    const longestmessagewidth = Math.max(
        getTextDimensions(
            messages.reduce(
                (max, msg) =>
                    max.length > msg.content.length ? max : msg.content,
                "" as string
            ),
            12
        ).width,
        300
    );

    //#region Initialize the actors
    const actors = data.actors.map((actor, i) => {
        const cell = createActor({ value: actor, index: i });
        setBounds(cell, { x: i * longestmessagewidth });

        return cell;
    });

    //#region Process the messages

    // Add elements
    elements.push(_, rootcell, ...actors);

    return {
        elements: [file],
    };
};
