import type { DIOMxCell, DIOMxPoint } from "~/models/DrawIOXML";

interface MakePointArgs {
    x: number;
    y: number;
    as?: DIOMxPoint["attributes"]["as"];
}

export default ({ as, x, y }: MakePointArgs): DIOMxPoint => {
    const attributes = {
        x,
        y,
        as,
    };

    return {
        attributes,
        type: "element",
        name: "mxPoint",
        elements: [],
    } satisfies DIOMxPoint;
};
