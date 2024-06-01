import { createStyleValues, type DIOMxCell } from "~/models/DrawIOXML";
import { type Message } from "../../models/SequenceDiagramData";
import {
    ConvertUtil,
    SELF_MESSAGE_GAP,
    SELF_MESSAGE_HEIGHT,
} from "./converter";
import getBounds from "../getBounds";
import makeMXGeometry from "./makeMXGeometry";
import makeMXPoint from "./makeMXPoint";
import makeMXCell from "./makeMXCell";
import makeMXArray from "./makeMXArray";
import createActivation from "./createActivation";
import setBounds from "../setBounds";

interface MessageParams {
    message: Message;
    lifeline: DIOMxCell;
    actor: DIOMxCell;
}

export default ({
    message: { content, receiver, sender, type },
    actor,
    lifeline,
}: MessageParams): DIOMxCell[] => {
    const lifeline_id = ConvertUtil.new_id;
    const msgid = ConvertUtil.new_id;

    //#region Preparation
    const { x: lx = 0, width: lw = 1 } = getBounds(lifeline);

    //#region Message

    const msg_style = createStyleValues({
        html: 1,
        align: "left",
        spacingLeft: 2,
        endArrow: "block",
        rounded: 0,
        edgeStyle: "orthogonalEdgeStyle",
        curved: 0,
    })
        .slice(0, -1)
        .concat(`rounded=0;`);

    const msg_attributes = {
        id: msgid,
        value: content,
        style: msg_style,
        parent: 1,
        target: lifeline_id,
        edge: 1,
    };

    const mx = lx + lw;
    const my = ConvertUtil.new_y("self-message");
    const msg_geom = makeMXGeometry({ relative: 1 });
    const msg_source_point = makeMXPoint({ as: "sourcePoint", x: mx, y: my });
    // A very rare element that I think I should make a builder but I am too lazy now tbh
    const msg_arr_points = makeMXArray({ as: "points" });
    msg_arr_points.elements.push(
        makeMXPoint({ x: mx + 40, y: my + SELF_MESSAGE_GAP + 20 })
    );
    msg_geom.elements.push(msg_source_point, msg_arr_points);

    const msg_cell: DIOMxCell = {
        attributes: msg_attributes,
        elements: [msg_geom],
        type: "element",
        name: "mxCell",
    };

    //#endregion
    //#region Mini-Lifeline

    const lifeline_cell = createActivation({
        actor_id: 1,
        start: my + SELF_MESSAGE_GAP,
        end: my + SELF_MESSAGE_HEIGHT - 15,
    });
    lifeline_cell.attributes.id = lifeline_id;
    setBounds(lifeline_cell, { x: lx + lw / 2 });

    return [lifeline_cell, msg_cell];
};
