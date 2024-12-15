import { createStyleValues, type DIOMxCell } from "~/models/DrawIOXML";
import makeMXGeometry from "./makeMXGeometry";
import makeMXPoint from "./makeMXPoint";
import { BLOCK_CONDITION_LEFTMARGIN, BLOCK_CONDITION_TOPMARGIN } from "./converter.plant";
import makeMXCell from "./makeMXCell";

interface LabelParams {
    id: number;
    parent: DIOMxCell;
    text: string | number;
}

export const createLabel = ({ id, parent, text }: LabelParams) => {
    text = `${text}`;

    const style = createStyleValues({
        text: true,
        html: 1,
        fillColor: "default",
        fillStyle: "solid",
    });

    const width = getTextDimensions(text, 12).width;

    const geom = makeMXGeometry({
        width,
        height: 12,
        relative: 1,
    });

    const point = makeMXPoint({
        x: BLOCK_CONDITION_LEFTMARGIN,
        y: BLOCK_CONDITION_TOPMARGIN,
        as: "offset",
    });

    geom.elements.push(point);

    const cell = makeMXCell({
        id,
        value: text,
        style,
        parent: parent.attributes.id,
        vertex: 1,
    });

    cell.elements.push(geom);

    return cell;
};
