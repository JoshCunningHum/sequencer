import { createStyleValues, type DIOMxCell } from "~/models/DrawIOXML";
import { type Message } from "../../models/SequenceDiagramData";
import { ConvertUtil } from "./converter";
import getBounds from "../getBounds";
import makeMXGeometry from "./makeMXGeometry";
import makeMXPoint from "./makeMXPoint";
import makeMXCell from "./makeMXCell";

interface MessageParams {
    message: Message;
    source_lifeline: DIOMxCell;
    target_lifeline: DIOMxCell;
    source_actor: DIOMxCell;
    target_actor: DIOMxCell;
}

export default ({
    message: { content, receiver, sender, type },
    source_lifeline,
    target_lifeline,
    source_actor,
    target_actor,
}: MessageParams) => {
    const id = ConvertUtil.new_id;

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

    // Geometry and Coordinates
    const {
        x: sxl = 1,
        y: syl = 1,
        width: swl = 1,
        height: shl = 1,
    } = getBounds(source_lifeline);
    const {
        x: txl = 1,
        y: tyl = 1,
        width: twl = 1,
        height: thl = 1,
    } = getBounds(target_lifeline);
    const {
        x: sxa = 1,
        y: sya = 1,
        width: swa = 1,
        height: sha = 1,
    } = getBounds(source_actor);
    const {
        x: txa = 1,
        y: tya = 1,
        width: twa = 1,
        height: tha = 1,
    } = getBounds(target_actor);

    const sac = sxa + swa / 2;
    const tac = txa + twa / 2;
    const slc = sxl + swl / 2;
    const tlc = txl + twl / 2;

    const slh = swl / 2;
    const tlh = twl / 2;

    const is_self_message = receiver === sender;
    const ltr = sxa < txa;

    const messagewidth = Math.abs(txa - sxa);
    const geom = makeMXGeometry({ relative: 1, width: messagewidth });

    const y =
        ConvertUtil.new_y(is_self_message ? "self-message" : "message") + 12;

    const source_point = makeMXPoint({
        x: ltr ? sac + slh : sac - slh,
        y,
        as: "sourcePoint",
    });
    const target_point = makeMXPoint({
        x: ltr ? tac - tlh : tac + tlh,
        y,
        as: "targetPoint",
    });

    geom.elements.push(source_point, target_point);

    const cell = makeMXCell({ id, parent: 1, style, value: content });
    cell.attributes.edge = 1;

    cell.elements.push(geom);

    return cell;
};
