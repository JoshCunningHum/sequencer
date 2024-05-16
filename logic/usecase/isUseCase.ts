import { extractStyleValues, type DIOMxCell } from "~/models/DrawIOXML";
import findParent from "../findParent";
import isSystem from "./isSystem";

export default (cell: DIOMxCell, cells: DIOMxCell[]): boolean => {
    const styles = extractStyleValues(cell.attributes.style);
    const isStyleValid =
        "ellipse" in styles ||
        (propIs(styles, "rounded", 1) && propIs(styles, "arcSize", 50));
    if (!isStyleValid) return false;

    // Check parent if it is a system
    const parent = findParent(cell, cells);
    if (!parent) return false;
    if (!isSystem(parent, cells)) return false;

    return true;
};
