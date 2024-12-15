import type { DIOMxArray, DIOMxCell, DIOMxPoint } from "~/models/DrawIOXML";

interface MakeArrayArgs {
    as: DIOMxArray["attributes"]["as"];
}

export default ({ as }: MakeArrayArgs): DIOMxArray => {
    const attributes = {
        as,
    };

    return {
        attributes,
        type: "element",
        name: "Array",
        elements: [],
    } satisfies DIOMxArray;
};
