import { extractStyleValues, type DIOMxCell } from "~/models/DrawIOXML";
import propIs from "~/utils/propIs";

export default (cell: DIOMxCell, cells: DIOMxCell[]): boolean => {
    const styles = extractStyleValues(cell.attributes.style);
    return (
        "swimlane" in styles &&
        propIs(styles, "horizontal", 1) &&
        propIs(styles, "verticalAlign", "top")
    );
};
