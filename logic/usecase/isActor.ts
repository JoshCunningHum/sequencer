import { extractStyleValues, type DIOMxCell } from "~/models/DrawIOXML";

export default (cell: DIOMxCell, cells: DIOMxCell[]): boolean => {
    const styles = extractStyleValues(cell.attributes.style);
    return propIs(styles, "shape", "umlActor") && cell.attributes.parent === 1;
};
