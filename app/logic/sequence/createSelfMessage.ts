import { createStyleValues, type DIOMxCell } from "~/models/DrawIOXML";
import { type Message } from "../../models/SequenceDiagramData";
import getBounds from "../getBounds";
import setBounds from "../setBounds";
import {
    HEIGHT_SELFMESSAGE,
    ITEMS_GAP,
    LIFELINE_WIDTH,
    OFFSET_SELFMESSAGE,
    SELF_MESSAGE_GAP,
    WIDTH_SELFMESSAGE,
} from "./converter.plant";
import createActivation from "./createActivation";
import makeMXArray from "./makeMXArray";
import makeMXGeometry from "./makeMXGeometry";
import makeMXPoint from "./makeMXPoint";

interface MessageParams {
    message: Message;
    msg_id: number;
    bar_id: number;
    y: number;
    actor: DIOMxCell;
}

export default ({
    message: { content, receiver, sender, type },
    actor,
    bar_id,
    msg_id,
    y,
}: MessageParams): [DIOMxCell, DIOMxCell] => {
    //#region Preparation
    const { width: actor_width = 0 } = getBounds(actor);
    const actor_id = actor.attributes.id;
    const actor_center = actor_width / 2;

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
        id: msg_id,
        value: content,
        style: msg_style,
        parent: actor_id,
        target: bar_id,
        edge: 1,
    };

    const bar_width_scale = 0.8;

    const msg_x = actor_center + OFFSET_SELFMESSAGE;
    const msg_y = y;
    const msg_height = y + HEIGHT_SELFMESSAGE;
    const msg_width = msg_x + WIDTH_SELFMESSAGE;

    const msg_geom = makeMXGeometry({ relative: 1 });
    const msg_source_point = makeMXPoint({
        as: "sourcePoint",
        x: msg_x + LIFELINE_WIDTH * bar_width_scale,
        y: msg_y + ITEMS_GAP / 2,
    });

    // A very rare element that I think I should make a builder but I am too lazy now tbh
    const msg_arr_points = makeMXArray({ as: "points" });

    msg_arr_points.elements.push(makeMXPoint({ x: msg_width, y: msg_height - ITEMS_GAP / 2 }));
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
        actor_id,
        actor_width,
        end: msg_height,
        start: msg_y,
        id: bar_id,
        width: LIFELINE_WIDTH * bar_width_scale,
    });
    setBounds(lifeline_cell, { x: actor_center + OFFSET_SELFMESSAGE });

    return [lifeline_cell, msg_cell] as const;
};
