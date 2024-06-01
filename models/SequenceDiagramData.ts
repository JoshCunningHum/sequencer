import { convert } from "~/logic/sequence/converter";
import { parse } from "~/logic/sequence/parser";
import * as c from "xml-js";
import type { DIOMxCell } from "./DrawIOXML";
import cellByID from "~/logic/cellByID";

export enum SequenceProcessErrror {
    InvalidJSON = "Invalid JSON",
    InvalidBlock = "Invalid Block",
    InvalidAction = "Invalid Action",
    InvalidActor = "Invalid Actor",
}

export class SequenceDiagramData {
    public title: string = "";
    public actors: string[] = [];
    public elements: SequenceElement[] = [];
    public txt: string = "";

    process(data: string): string {
        this.txt = data;

        // Parse the said string
        const { actors, elements, title } = parse(data);
        this.title = title;
        this.actors = actors;
        this.elements = elements;

        console.log(`%cSequence Data:`, "color:orange");
        console.log(this);

        // Convert into DIOMXFile Format
        const jsoned = convert(this);

        console.log(`%cJSONED Data`, "color:turquoise");
        console.log(jsoned);

        const result = c.js2xml(jsoned, {
            spaces: 2,
            compact: false,
        });

        return result;
    }
}

export type SequenceElement = Message | Block | Note | Activation;

export interface Actor {
    name: string;
}

export interface Message {
    type: "sync" | "async" | "reply";
    sender: string;
    receiver: string;
    content: string;
    cellid?: number;
}

export type Block = {
    cellid?: number;
    elements: SequenceElement[];
    conditions: string[]; // for 'alt' blocks
} & (
    | {
          type: "alt" | "opt" | "par" | "loop";
          parent?: Block; // for nested blocks
      }
    | {
          type: "block";
          parent: Block;
      }
);

export interface Note {
    text: string;
    target: SequenceElement; // element this note is attached to
}

export interface Activation {
    actor: string;
    start: SequenceElement; // element where the activation starts
    end?: SequenceElement; // element where the activation ends (optional)
}

export const isSequenceMessage = (
    element: SequenceElement
): element is Message => {
    return "content" in element;
};

export const isSequenceBlock = (element: SequenceElement): element is Block => {
    return "elements" in element;
};

export const isSequenceNote = (element: SequenceElement): element is Note => {
    return "text" in element;
};

export const isSequenceActivation = (
    element: SequenceElement
): element is Activation => {
    return "actor" in element;
};
