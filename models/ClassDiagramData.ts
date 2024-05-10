import { DrawIOXML } from "./DrawIOXML";

export class ClassDiagramData extends DrawIOXML {

    public classes: ClassData[] = [];

    constructor(xml: string) {
        super(xml);
    }

    toPrompt(): string {
        throw new Error("Method not implemented.");
    }
    process(): void {
        throw new Error("Method not implemented.");
    }
    
}

export class ClassData {
    public name: string;
    public properties: string[] = [];

    constructor(name: string, properties: string[]) {
        this.name = name;
        this.properties = properties;
    }
}