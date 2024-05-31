import { extractStyleValues, type DIOMxCell } from "~/models/DrawIOXML";
import findParent from "../findParent";
import getBounds from "../getBounds";
import isSystem from "./isSystem";
import isBound from "../isBound";

export default (cell: DIOMxCell, cells: DIOMxCell[]): boolean => {
    const styles = extractStyleValues(cell.attributes.style);
    const isStyleValid =
        "ellipse" in styles ||
        (propIs(styles, "rounded", 1) && propIs(styles, "arcSize", 50));
    if (!isStyleValid) return false;

    const parent = findParent(cell, cells);
    const is_parent_system = !!parent && isSystem(parent, cells);
    if (is_parent_system) return true;

    // * Added a double checker for system containers that doesn't contain objects inside their bounds automatically
    const systems = cells.filter((cell) => isSystem(cell, cells));

    const isbounded = systems.some((sys) => isBound(sys, cell));

    return isbounded;
};
