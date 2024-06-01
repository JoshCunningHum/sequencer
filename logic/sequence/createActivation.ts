import { createStyleValues, type DIOMxCell } from "~/models/DrawIOXML";
import { ConvertUtil } from "./converter";
import makeMXGeometry from "./makeMXGeometry";

interface ActivationParams {
    actor_id: number;
    start: number;
    end: number;
    width?: number;
}

export default ({
    actor_id,
    end,
    start,
    width = 10,
}: ActivationParams): DIOMxCell => {
    const style = createStyleValues({
        html: 1,
        points: [
            [0, 0, 0, 0, 5],
            [0, 1, 0, 0, -5],
            [1, 0, 0, 0, 5],
            [1, 0, 0, 0, -5],
        ],
        perimeter: "orthogonalPerimeter",
        outlineConnect: 0,
        targetShapes: "umlLifeline",
        portConstraint: "eastwest",
        newEdgeStyle: {
            curved: 0,
            rounded: 0,
        },
    });

    const attributes: DIOMxCell["attributes"] = {
        id: ConvertUtil.new_id,
        style,
        parent: actor_id,
        vertex: 1,
    };

    // TODO: Layout issue when actor box height is greater than 40 or width is greater than 100
    const geom = makeMXGeometry({
        x: 50 - width / 2,
        y: start,
        width,
        height: end - start + 10,
    });

    return {
        type: "element",
        name: "mxCell",
        attributes,
        elements: [geom],
    } satisfies DIOMxCell;
};
