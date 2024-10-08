import isClass from "~/logic/class/isClass";
import { DrawIOXML, isMxfile, type DIOMxCell } from "./DrawIOXML";
import findChildren from "~/logic/findChildren";
import isField from "~/logic/class/isField";

export enum ClassProcessError {
    InvalidJSON = "Invalid JSON",
}

export class ClassDiagramData extends DrawIOXML {
    public pages: ClassPage[] = [];

    constructor(xml: string) {
        super(xml);
    }

    toPrompt(): string {
        return this.pages
            .map((p, i) => {
                const uml = p.toString();
                if (!uml) return "";
                return `${i + 1}.) ${uml}`;
            })
            .join("\n\n");
    }
    process(): void {
        // Get the JSON
        const { elements: json } = this.json;
        // Check if valid JSON
        if (!json) throw new Error(ClassProcessError.InvalidJSON);
        // Check if it is a valid DrawIO JSON File
        const [mxfile] = json;

        if (!isMxfile(mxfile)) throw new Error(ClassProcessError.InvalidJSON);

        this.pages.splice(0);
        const pages = mxfile.elements.map((diagram) => {
            const title = diagram.attributes?.name as string;

            const cells = diagram.elements[0]?.elements[0]?.elements as DIOMxCell[];

            const classes = cells
                .filter((cell) => isClass(cell, cells))
                .map((c) => {
                    const children = findChildren(c, cells);
                    const fields = children
                        .filter((child) => isField(child, [c]))
                        .map((f) => f.attributes.value || "");

                    return new ClassData(c.attributes.value || "", fields);
                });

            return new ClassPage(title, classes);
        });

        // To maintain vue reactivity
        this.pages.push(...pages);
    }
}

export class ClassPage {
    name: string;
    data: ClassData[];

    constructor(name: string, data: ClassData[]) {
        this.name = name;
        this.data = data;
    }

    toString() {
        if (this.data.length === 0) return "";

        return `@startuml\ntitle ${this.name}\n${this.data.map((c, i) => c.toPrompt()).join("\n")}\n@enduml`;
    }
}

export class ClassData {
    public name: string;
    public properties: string[] = [];

    constructor(name: string, properties: string[]) {
        this.name = name.replace("\n", "").replace("<>", "").trim(); // remove all new lines
        this.properties = properties;
    }

    toPrompt() {
        let str = `class ${this.name.split(/\s/).join("")} `;

        if (this.properties.length > 0) {
            str += `{\n${this.properties.map((p) => `\t${p}\n`).join("")}}`;
        } else str += "{}";

        return str;
    }
}
