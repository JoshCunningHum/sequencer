import type { Token } from "~/logic/sequence/lexer.plant";

export enum SequenceProcessErrror {
    InvalidJSON = "Invalid JSON",
    InvalidBlock = "Invalid Block",
    InvalidAction = "Invalid Action",
    InvalidActor = "Invalid Actor",
}

export interface SequencePage {
    name: string;
    elements: SequenceElement[];
    actors: Actor[];
    messages: Message[];
}

export type SequenceElement = Message | Block | Note | Activation;

export interface Actor {
    name: string;
    participant?: boolean;
    token: Token;
}

export interface Message {
    type: "sync" | "async" | "reply";
    sender: string;
    receiver: string;
    content: string;
    cellid?: number;
    token: Token;
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
    type: "start" | "end";
}

export const isSequenceMessage = (
    element: SequenceElement,
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
    element: SequenceElement,
): element is Activation => {
    return "actor" in element;
};
