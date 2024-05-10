export enum SequenceProcessErrror {
    InvalidJSON = "Invalid JSON",
    InvalidBlock = "Invalid Block",
    InvalidAction = "Invalid Action",
    InvalidActor = "Invalid Actor"
}

export class SequenceDiagramData {

    public actors: string[] = [];
    public data: (Block| Action)[] = [];

    process(data: string) : string {
        // Parse the data to JSON, throw an error if the returned data is not a json
        let json;

        try {
            json = JSON.parse(data);
        }catch(e) {
            throw new Error(SequenceProcessErrror.InvalidJSON);
        }

        return data;
    }
}

interface ActionArgs {
    from: string;
    to: string;
    value: string;
    isAsync?: boolean;
}

export class Action {
    public from: string;
    public to: string;
    public value: string;
    public isAsync: boolean = false;

    constructor({ from, to, value, isAsync = false } : ActionArgs) {
        this.from = from;
        this.to = to;
        this.value = value;
        this.isAsync = isAsync;
    }

}

export enum BlockType {
    Regular,
    Alt,
    Opt
}

export class Block {
    public data: (Block | Action)[] = [];
    type: BlockType = BlockType.Regular;
}