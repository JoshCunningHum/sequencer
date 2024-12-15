import { createStyleValues, type DIOMxCell } from "~/models/DrawIOXML";
import makeMXGeometry from "./makeMXGeometry";
import getBounds from "../getBounds";
import makeMXCell from "./makeMXCell";
import { BLOCK_CONDITION_LEFTMARGIN } from "./converter.plant";

interface DashedLineParams {
    y: number; // absolute to the page
    parent: DIOMxCell;
    id: number;
    text: string | number;
}

// Create dashed portion of a block
export const createDashed = ({ y, id, parent, text }: DashedLineParams) => {
    const style = createStyleValues({
        line: true,
        strokeWidth: 1,
        dashed: 1,
        labelPosition: "center",
        verticalLabelPosition: "bottom",
        align: "left",
        verticalAlign: "top",
        spacingLeft: BLOCK_CONDITION_LEFTMARGIN,
        fillColor: "default",
        fillStyle: "solid",
    });

    const cell = makeMXCell({
        id,
        parent: parent.attributes.id,
        vertex: 1,
        style,
        value: `${text}`,
    });

    const { y: parent_y = 0, width: parent_width } = getBounds(parent);

    const geom = makeMXGeometry({
        height: 1,
        y: y - parent_y,
        width: parent_width,
    });

    cell.elements.push(geom);

    return cell;
};
