import { ConvertUtil, NESTED_BLOCK_PADD, traversebf } from "./converter";

import { createStyleValues, type DIOMxCell } from "~/models/DrawIOXML";
import {
    isSequenceBlock,
    isSequenceMessage,
    type Block,
} from "~/models/SequenceDiagramData";
import getBounds from "../getBounds";
import makeMXGeometry from "./makeMXGeometry";
import makeMXCell from "./makeMXCell";
import makeMXPoint from "./makeMXPoint";
import * as c from "xml-js";
import setBounds from "../setBounds";

interface BlockParams {
    block: Block;
    actor_cells: DIOMxCell[];
    actor_record: Record<
        string,
        {
            actor: DIOMxCell;
            lifeline: DIOMxCell;
        }
    >;

    elements: DIOMxCell[];
}

export default ({
    block,
    actor_cells,
    actor_record,
    elements,
}: BlockParams): DIOMxCell => {
    //#region Dimension Calculations
    // Get the height of the block based on the overall sum of the height of its children
    const last_y = ConvertUtil.y;
    let last_depth = -1,
        nested_count = 0;

    const actor_set = new Set<string>();

    traversebf(block.elements, (item, i, depth) => {
        ConvertUtil.yfrom(item);
        // Get the overall width of the block based on the coordinates of the actor_record
        // and the amount of nested blocks inside it
        if (
            last_depth !== depth &&
            isSequenceBlock(item) &&
            item.type !== "block"
        ) {
            nested_count++;
            last_depth = depth;
        } else if (isSequenceMessage(item)) {
            actor_set.add(item.sender);
            actor_set.add(item.receiver);
        }
    });

    const height = ConvertUtil.y - last_y + 12;
    const involved_actors = Array.from(actor_set);
    const [start_actor, end_actor] = involved_actors.reduce(
        ([leftmost, rightmost], actor) => {
            const { actor: actor_cell } = actor_record[actor];
            if (!actor_cell) return [leftmost, rightmost];

            const { x } = getBounds(actor_cell);
            const { x: lx } = getBounds(leftmost);
            const { x: rx } = getBounds(rightmost);

            const nl =
                x !== undefined && lx !== undefined && x < lx
                    ? actor_cell
                    : leftmost;
            const nr =
                x !== undefined && rx !== undefined && x > rx
                    ? actor_cell
                    : rightmost;

            return [nl, nr];
        },
        [actor_cells[actor_cells.length - 1], actor_cells[0]]
    );

    const { x: sx = 1 } = getBounds(start_actor);
    const { x: ex = 1, width: ew = 1 } = getBounds(end_actor);

    const nested_padding = (nested_count * NESTED_BLOCK_PADD) / 2;
    const width = ex + ew - sx + nested_padding * 2;
    const x = sx - nested_padding;

    ConvertUtil.y = last_y;

    const geom = makeMXGeometry({
        x,
        y: ConvertUtil.new_y("block"),
        width,
        height,
    });

    //#region Cell Instantiation
    if (block.type === "block") {
        const parent = block.parent;
        const parent_cell = elements.findLast(
            (cell) => cell.attributes.id === parent.cellid
        );

        let text = "";
        let style = "";
        switch (parent.type) {
            case "alt":
                // Check if this block is the first condition
                const [condition] = block.conditions;

                if (!condition || condition === parent.conditions[0]) {
                    style = createStyleValues({
                        text: true,
                        html: 1,
                        fillColor: "default",
                        fillStyle: "solid",
                    });
                    text = parent.conditions[0];

                    // Modify Width and Height
                    setBounds(geom, {
                        ...getTextDimensions(text, 12),
                        x: 0,
                        y: 0,
                        relative: 1,
                    });

                    // add a MXPoint insidet the geom
                    const point = makeMXPoint({
                        x: 20,
                        y: 30,
                        as: "offset",
                    });
                    geom.elements.push(point);
                } else {
                    style = createStyleValues({
                        line: true,
                        strokeWidth: 1,
                        dashed: 1,
                        labelPosition: "center",
                        verticalLabelPosition: "bottom",
                        align: "left",
                        verticalAlign: "top",
                        spacingLeft: 20,
                        fillColor: "default",
                        fillStyle: "solid",
                    });
                    text = parent.conditions[1];

                    // Modify Width and Height
                    const curr_y = geom.attributes.y || 1;
                    const parent_bounds = !!parent_cell
                        ? getBounds(parent_cell)
                        : null;

                    const parent_y = !!parent_cell ? parent_bounds?.y || 0 : 0;
                    const parent_width = parent_bounds?.width || width;

                    setBounds(geom, {
                        x: 0,
                        y: curr_y - parent_y,
                        height: 1,
                        width: parent_width,
                    });
                }
                break;
            case "opt":
            case "loop":
                text = parent.conditions[0];
                break;
            case "par":
                break;
            default:
                throw new Error(
                    `Block type not a possible parent for a block with 'block' as type`
                );
        }
        ConvertUtil.new_y("block");

        const cell = makeMXCell({
            id: ConvertUtil.new_id,
            parent: parent.cellid || 1,
            value: text,
            style,
            vertex: 1,
        });

        cell.elements.push(geom);

        return cell;
    }

    const style = createStyleValues({
        shape: "umlFrame",
        whiteSpace: "wrap",
        html: 1,
        pointerEvents: 0,
        recursiveResize: 0,
        container: 1,
        collapsible: 0,
        width: 60,
        height: 30,
    });

    const attributes = {
        id: ConvertUtil.new_id,
        value: block.type,
        style,
        parent: 1,
        vertex: 1,
    };

    const cell = makeMXCell(attributes);
    cell.elements.push(geom);

    return cell;
};
