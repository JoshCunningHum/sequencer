import { createStyleValues, type DIOMxCell } from "~/models/DrawIOXML";
import makeMXGeometry from "./makeMXGeometry";

interface ActorParams {
    value: string;
    index: number;
    height: number;
    id?: number;
    width: number;
}

export default ({ value, index, height, id, width }: ActorParams): DIOMxCell => {
    const { width: txtwidth, height: txtheight } = getTextDimensions(value);
    const style = createStyleValues({
        shape: "umlLifeline",
        perimeter: "lifelinePerimeter",
        whiteSpace: "wrap",
        html: 1,
        container: 1,
        dropTarget: 0,
        collapsible: 0,
        recursiveResize: 0,
        outlineConnect: 0,
        portConstraint: "eastwest",
        newEdgeStyle: {
            curved: 0,
            rounded: 0,
        },
        size: height,
    });

    const attributes: DIOMxCell["attributes"] = {
        id: id || -1,
        value,
        style,
        parent: 1,
        vertex: 1,
    };

    // Actor Geometry
    const geom = makeMXGeometry({ x: index * 300, y: 0, width, height: 1000 });

    return {
        type: "element",
        name: "mxCell",
        elements: [geom],
        attributes,
    } satisfies DIOMxCell;
};
