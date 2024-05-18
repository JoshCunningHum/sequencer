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

    process(data: string): string {
        // Parse the said string
        const lines = data.trim().split("\n");

        let currentblock: Block | null = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
        }

        return data;
    }
}

export type SequenceElement = Message | Block | Note;

export interface Actor {
    name: string;
}

export interface Message {
    type: "sync" | "async" | "reply";
    sender: string;
    receiver: string;
    content: string;
}

export interface Block {
    type: "alt" | "opt" | "par" | "loop" | "block";
    elements: SequenceElement[];
    conditions: string[]; // for 'alt' blocks
    parent?: Block; // for nested blocks
}

export interface Note {
    text: string;
    target: SequenceElement; // element this note is attached to
}
