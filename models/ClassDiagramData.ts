import isClass from "~/logic/class/isClass";
import { DrawIOXML, isMxfile, type DIOMxCell } from "./DrawIOXML";
import findChildren from "~/logic/findChildren";
import isField from "~/logic/class/isField";

export enum ClassProcessError {
    InvalidJSON = "Invalid JSON",
}

export const class_default = useDrawIOClassDefault();

export class ClassDiagramData extends DrawIOXML {
    public classes: ClassData[] = [];

    constructor(xml: string) {
        super(xml);
    }

    toPrompt(): string {
        return this.classes.reduce((str, c, i, arr) => {
            str += c.name + " ";

            if (c.properties.length > 0) {
                str += "{\n";
                c.properties.forEach((p, i) => {
                    str += "\t" + p + "\n";
                });
                str += "}";
            } else str += "{}";

            if (i < arr.length - 1) str += "\n";

            return str;
        }, "");
    }
    process(): void {
        // Get the JSON
        const { elements: json } = this.json;
        // Check if valid JSON
        if (!json) throw new Error(ClassProcessError.InvalidJSON);
        // Check if it is a valid DrawIO JSON File
        const [mxfile] = json;
        if (!isMxfile(mxfile)) throw new Error(ClassProcessError.InvalidJSON);

        // TODO: Add multipage support
        const diagram = mxfile.elements[0];

        const cells: DIOMxCell[] = diagram.elements[0].elements[0].elements;

        const classes = cells.filter((cell) => isClass(cell, cells));

        // Loop through the classes and add them to class data along with their fields
        this.classes.splice(0);
        classes.forEach((c) => {
            const children = findChildren(c, cells);
            const fields = children.filter((child) => isField(child, [c]));

            // field values
            const field_mapped = fields.map((f) => f.attributes.value || "");

            // Create class data
            const data = new ClassData(c.attributes.value || "", field_mapped);
            this.classes.push(data);
        });
    }
}

export class ClassData {
    public name: string;
    public properties: string[] = [];

    constructor(name: string, properties: string[]) {
        this.name = name.replace("\n", "").trim(); // remove all new lines
        this.properties = properties;
    }
}
