import { extractStyleValues, type DIOMxCell } from "~/models/DrawIOXML";

export default (cell: DIOMxCell, cells: DIOMxCell[]): boolean => {
    const styles = extractStyleValues(cell.attributes.style);
    return (
        ("swimlane" in styles || styles.shape === "umlFrame") &&
        cell.attributes.parent === 1
    );
};
