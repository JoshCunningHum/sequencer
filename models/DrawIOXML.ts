import * as convert from "xml-js";

// DRAWIO CONSTANTS
export const PAGE_WIDTH = 850;
export const PAGE_HEIGHT = 1100;

export abstract class DrawIOXML {
    xml: string;
    json: DrawIOJson = { elements: [] };

    constructor(xml: string) {
        this.xml = xml;
    }

    toJSON(): DrawIOJson {
        this.json = convert.xml2js(this.xml, {
            compact: false,
            ignoreComment: true,
            trim: true,
            nativeType: true,
            /**
             * They forgot to add this option to the types
             * @see https://github.com/nashwaan/xml-js?tab=readme-ov-file#convert-xml--js-object--json
             * @ts-expect-error "Documentation says there is an option like this" */
            nativeTypeAttributes: true,
            alwaysChildren: true,
            alwaysArray: true,
            ignoreDeclaration: true,
            sanitize: true,
            attributeValueFn: (value, name, parent) => {
                if (typeof value !== "string") return value;
                // Replace all entities and tags
                return decodeHTMLEntities(removeHTMLTags(value));
            },
        }) as DrawIOJson;

        return this.json;
    }

    abstract toPrompt(): string;
    abstract process(): void;
}

type XMLNode = {
    type: "element" | "comment";
    name: string;
    attributes?: Record<string, string | number | boolean | undefined>;
    elements: XMLNode[];
};

export type DrawIOJson = Pick<XMLNode, "elements">;

// #region DrawIO XML Node Formats
export type DIOMxfile = XMLNode & {
    name: "mxfile";
    type: "element";
    attributes: {
        host: string;
        modified: string;
        agent: string;
        etag: string;
        version: string;
        type: string; // ? might add "embed"
    };
    elements: DIODiagram[];
};

export const isMxfile = (node: XMLNode): node is DIOMxfile =>
    node.name === "mxfile";

export type DIODiagram = XMLNode & {
    // * Essentially a DRAW IO Page
    name: "diagram";
    type: "element";
    attributes: {
        name: string;
        id: string;
    };
    elements: DIOMxGraphModel[];
};

export const isDiagram = (node: XMLNode): node is DIODiagram =>
    node.name === "diagram";

export type DIOMxGraphModel = XMLNode & {
    type: "element";
    name: "mxGraphModel";
    attributes: {
        dx: number;
        dy: number;
        grid: number;
        gridSize: number;
        guides: number;
        tooltips: number;
        connect: number;
        arrows: number;
        fold: number;
        page: number;
        pageScale: number;
        pageWidth: number;
        pageHeight: number;
        math: number;
        shadow: number;
    };
    elements: {
        type: "element";
        name: "root";
        elements: DIOMxCell[];
    }[];
};

export const isMxGraphModel = (node: XMLNode): node is DIOMxGraphModel =>
    node.name === "mxGraphModel";

export type DIOMxCell = XMLNode & {
    type: "element";
    name: "mxCell";
    attributes: {
        id: number;
        parent?: number;
        value?: string;
        style?: string;
        vertex?: number;
        source?: number;
        target?: number;
    };
    elements: DIOMxGeometry[];
};

export const isMxCell = (node: XMLNode): node is DIOMxCell =>
    node.name === "mxCell";

export type DIOMxGeometry = XMLNode & {
    type: "element";
    name: "mxGeometry";
    attributes: {
        x?: number;
        y?: number;
        width: number;
        height: number;
        as: "geometry";
        relative?: number;
    };
    elements: (DIOMxPoint | DIOMxArray)[];
};

export type DIOMxPoint = XMLNode & {
    type: "element";
    name: "mxPoint";
    attributes: {
        x: number;
        y: number;
        as?: "targetPoint" | "sourcePoint" | "offset";
    };
};

export type DIOMxArray = XMLNode & {
    type: "element";
    name: "Array";
    attributes: {
        as: "points";
    };
    elements: DIOMxPoint[];
};

export const isMxGeometry = (node: XMLNode): node is DIOMxGeometry =>
    node.name === "mxGeometry";

export const extractStyleValues = (style?: string): Record<string, any> => {
    const values: Record<string, any> = {};
    if (!style) return values;

    const styles = style.split(";");
    for (const prop of styles) {
        const [key, value] = prop.split("=");

        if (value) {
            const num = Number(value);
            if (!isNaN(num)) {
                values[key] = num;
            } else if (value === "true" || value === "false") {
                values[key] = value === "true" ? true : false;
            } else {
                values[key] = value;
            }
        } else {
            values[key] = true;
        }
    }
    return values;
};

export const createStyleValues = (style?: Record<string, any>): string => {
    if (!style) return "";
    return Object.entries(style)
        .map(([key, value]) =>
            value === true
                ? key
                : `${key}=${typeof value === "object" ? JSON.stringify(value) : value}`
        )
        .join(";");
};
