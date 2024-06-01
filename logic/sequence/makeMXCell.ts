import type { DIOMxCell } from "~/models/DrawIOXML";
import type { Bounds } from "../getBounds";
import makeMXGeometry from "./makeMXGeometry";

interface MakeCellArgs {
    id: number;
    parent?: number;
    value?: string;
    style?: string;
    vertex?: number;
    source?: number;
    target?: number;
    bound?: Bounds;
}

export default ({
    id,
    parent,
    target,
    source,
    style,
    value,
    vertex,
    bound,
}: MakeCellArgs): DIOMxCell => {
    const data: DIOMxCell = {
        attributes: {
            id,
            parent,
            target,
            source,
            style,
            value,
            vertex,
        },
        elements: [],
        name: "mxCell",
        type: "element",
    };

    if (bound) {
        const geom = makeMXGeometry({ ...bound });
        data.elements.push(geom);
    }

    return data;
};
