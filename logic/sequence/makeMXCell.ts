import type { DIOMxCell } from "~/models/DrawIOXML";
import type { Bounds } from "../getBounds";
import makeMXGeometry from "./makeMXGeometry";

interface MakeCellArgs {
    id: number;
    parent?: number;
    value?: string;
    style?: string;
    vertext?: number;
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
    vertext,
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
            vertext,
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
