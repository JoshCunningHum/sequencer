import { createStyleValues } from "~/models/DrawIOXML";
import { type Message } from "../../models/SequenceDiagramData";
import makeMXCell from "./makeMXCell";
import makeMXGeometry from "./makeMXGeometry";
import makeMXPoint from "./makeMXPoint";

interface MessageParams {
    message: Message;
    id?: number;
    startX: number;
    endX: number;
    y: number;
}

export default ({
    message: { content, receiver, sender, type },
    endX,
    startX,
    y,
    id = -1,
}: MessageParams) => {
    const style = createStyleValues({
        html: 1,
        verticalAlign: "bottom",
        endArrow: "block",
        curved: 0,
        rounded: 0,
        dashed: type === "async" ? 1 : 0,
        dashPattern: type === "async" ? "8 8" : "",
        fillColor: "default",
        fillStyle: "solid",
    });

    const messagewidth = Math.abs(endX - startX);
    const geom = makeMXGeometry({ relative: 1, width: messagewidth });

    const ltr = startX < endX;

    const source_offset = 0;
    const source_point = makeMXPoint({
        x: startX + (ltr ? source_offset : -source_offset),
        y,
        as: "sourcePoint",
    });
    const target_point = makeMXPoint({
        x: endX,
        y,
        as: "targetPoint",
    });

    geom.elements.push(source_point, target_point);

    const cell = makeMXCell({ id, parent: 1, style, value: content });
    cell.attributes.edge = 1;

    cell.elements.push(geom);

    return cell;
};
