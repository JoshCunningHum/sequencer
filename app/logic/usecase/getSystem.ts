import type { DIOMxCell } from "~/models/DrawIOXML";
import isSystem from "./isSystem";
import findParent from "../findParent";

// Gets the system of the object is in
export default (cell: DIOMxCell, cells: DIOMxCell[]) => {
    let curr = cell;

    while (!!curr.attributes.parent) {
        if (isSystem(curr, cells)) break;
        const parent = findParent(curr, cells);
        if (parent) curr = parent;
        else return undefined; // If parent not found, then the cells[] is not sufficient
    }
    if (!curr.attributes.parent) return undefined;
    return curr;
};
