import getBounds from "~/logic/getBounds";
import setBounds from "~/logic/setBounds";
import { extractStyleValues, type DIOMxCell } from "~/models/DrawIOXML";
import type { Actor, Message } from "~/models/SequenceDiagramData";
import {
    BLOCK_LEVEL_PAD_LEFT,
    BLOCK_LEVEL_PAD_RIGHT,
    BLOCK_SELFMSG_EXPANSION,
} from "../converter.plant";
import type { ActorHelper } from "./actor";

/**
 * For managing block expansion and positioning
 */
export class BlockHelper {
    actors: ActorHelper;

    stack: DIOMxCell[] = [];
    labels: Map<number, DIOMxCell[]> = new Map();

    genid: () => number;

    constructor({ genid, actors }: { genid: () => number; actors: ActorHelper }) {
        this.genid = genid;
        this.actors = actors;
    }

    get depth() {
        return this.stack.length;
    }

    add(block: DIOMxCell) {
        const styles = extractStyleValues(block.attributes.style);
        const isParentBlock = propIs(styles, "shape", "umlFrame");

        if (isParentBlock) {
            this.stack.push(block);
        } else {
            const parent = block.attributes.parent!;

            const arr = this.labels.get(parent) || [];
            arr.push(block);
            this.labels.set(parent, arr);
        }
    }

    // Called when adding messages, will resize the current block
    involves(actor: Actor | string) {
        actor = this.actors.name(actor);

        const block = this.stack.at(-1);
        if (!block) return;

        const { x = 0, width = 0 } = getBounds(block);
        const right = x + width;
        if (this.actors.isActorWithin(actor, x, right)) return;

        const covered_actors = this.actors
            .getActorsWithin(x, right)
            .map((a) => a.attributes.value!);
        if (!covered_actors.includes(actor)) covered_actors.push(actor);
        console.log(covered_actors, actor);

        const [leftmost, rightmost] = this.actors.getBoundsMult(covered_actors);

        if (leftmost < x || x === 0) {
            const start = leftmost - BLOCK_LEVEL_PAD_LEFT;
            const new_width = right - start;

            setBounds(block, { x: start, width: new_width });
        }

        if (rightmost > right) {
            const left = leftmost < x || x === 0 ? leftmost - BLOCK_LEVEL_PAD_LEFT : x;

            setBounds(block, {
                width: rightmost - left + BLOCK_LEVEL_PAD_RIGHT,
            });
        }

        this.expandLabels(block);
    }

    get current() {
        return this.stack.at(-1);
    }

    get current_bounds() {
        const block = this.current;
        if (!block) return undefined;
        return getBounds(block);
    }

    expandForSelfMsg(item: Message) {
        const block = this.current;
        if (!block) return;

        const { x = 0, width = 0 } = getBounds(block);
        const covered_actors = this.actors
            .getActorsWithin(x, x + width)
            .slice(0, -1) // Do not include the first and last element
            .map((a) => a.attributes.value);
        const actor = item.sender;

        if (covered_actors.includes(actor)) return;

        setBounds(block, {
            width: width + BLOCK_SELFMSG_EXPANSION + BLOCK_LEVEL_PAD_LEFT,
        });

        this.expandLabels(block);
    }

    pop() {
        // Pop the last block and expand its parent
        const popped = this.stack.pop();

        const parent = this.stack.at(-1);
        if (!parent || !popped) return;

        const { x: p_left = 0, width: p_width = 0 } = getBounds(parent);
        const p_right = p_left + p_width;

        const { x: c_left = 0, width: c_width = 0 } = getBounds(popped);
        const c_right = c_left + c_width;

        console.log(c_left, c_right, p_left, p_right);

        // expand left
        if (c_left <= p_left || p_left === 0) {
            setBounds(parent, {
                x: c_left - BLOCK_LEVEL_PAD_LEFT,
                width: p_width + (p_left - c_left),
            });
        }

        // expand right
        if (c_right >= p_right || p_right === 0) {
            // Update the values (incase it was changed for expanding left)
            const { x: p_left = 0 } = getBounds(parent);

            setBounds(parent, {
                width: c_right + BLOCK_LEVEL_PAD_RIGHT - p_left,
            });
        }

        this.expandLabels(parent);
    }

    expandLabels(block: DIOMxCell) {
        const id = block.attributes.id;
        const labels = this.labels.get(id);
        if (!labels) return;

        const { width, x } = getBounds(block);
        labels.forEach((label) => setBounds(label, { width, x }));
    }
}

const id = <T extends number | undefined = undefined>(
    cell: DIOMxCell,
    value?: T
): T extends number ? undefined : number => {
    if (value) cell.attributes.id = value;
    else return cell.attributes.id as any;
    return undefined as any; // to satisfy ts
};
