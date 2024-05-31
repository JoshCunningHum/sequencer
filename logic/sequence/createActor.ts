import { createStyleValues, type DIOMxCell } from "~/models/DrawIOXML";
import { ConvertUtil } from "./converter";
import makeMXGeometry from "./makeMXGeometry";

interface ActorParams {
    value: string;
    index: number;
}

export default ({ value, index }: ActorParams): DIOMxCell => {
    const { width: txtwidth, height: txtheight } = getTextDimensions(value);
    const width = Math.max(txtwidth, 60) + 40;
    const bx_height = Math.max(txtheight, 20) + 20;
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
        size: bx_height,
    });

    const attributes: DIOMxCell["attributes"] = {
        id: ConvertUtil.new_id,
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
