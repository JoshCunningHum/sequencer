import { extractStyleValues, type DIOMxCell } from "~/models/DrawIOXML";
import findParent from "../findParent";
import isClass from "./isClass";

export default (cell: DIOMxCell, cells: DIOMxCell[]) => {
    // Check first the styles
    const styles = extractStyleValues(cell.attributes.style);
    const isStyleValid = "text" in styles && propIs(styles, "align", "left");

    if (!isStyleValid) return false;

    // * This is last because it is costly
    const parent = findParent(cell, cells);
    if (!parent) return false;
    const isParentAClass = isClass(parent, cells);
    if (!isParentAClass) return false;

    return true;
};
