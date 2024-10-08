import setBounds from "~/logic/setBounds";
import type { DIOMxCell } from "~/models/DrawIOXML";
import type { Actor } from "~/models/SequenceDiagramData";
import { LIFELINE_WIDTH, ACTOR_MIN_WIDTH, ACTOR_PADDING } from "../converter.plant";
import getBounds from "~/logic/getBounds";

export class ActorHelper {
    actors: string[];
    gap: number;

    bounds: Map<string, [number, number, number, number, number]>;
    cells: Map<string, DIOMxCell> = new Map();

    constructor(actors: Actor[], gap: number) {
        this.actors = actors.map((a) => a.name);
        this.gap = gap;

        const offset = LIFELINE_WIDTH / 2;

        // Perform coordinate calcuations
        const bounds: ActorHelper["bounds"] = new Map();
        actors.reduce((acc, actor) => {
            const txtwidth = getTextDimensions(actor.name, 12).width;
            const widthpx = Math.max(txtwidth, ACTOR_MIN_WIDTH) + ACTOR_PADDING;
            const center = acc + widthpx / 2;

            const left = center - offset;
            const right = center + offset;

            bounds.set(actor.name, [
                actor.participant ? left : center,
                center,
                actor.participant ? right : center,
                widthpx,
                acc,
            ]);
            return acc + widthpx + gap;
        }, 0);

        this.bounds = bounds;
    }

    name(actor: string | Actor) {
        if (typeof actor === "string") return actor;
        return actor.name;
    }

    is(actor: string | Actor) {
        actor = this.name(actor);

        const [source_bound] = this.bounds.get(actor) || [];
        if (!source_bound) return undefined;

        const before = (actor: string) => {
            const [target_bound] = this.bounds.get(actor) || [];
            if (!target_bound) return undefined;
            return source_bound < target_bound;
        };

        const after = (actor: string) => {
            const [target_bound] = this.bounds.get(actor) || [];
            if (!target_bound) return undefined;
            return source_bound > target_bound;
        };

        return { before, after };
    }

    id(actor: Actor | string) {
        actor = this.name(actor);
        return this.cells.get(actor)?.attributes.id;
    }

    coord(actor: Actor | string) {
        actor = this.name(actor);
        const bounds = this.bounds.get(actor);

        if (!bounds) return undefined;
        const [left, center, right, width, x] = bounds;

        return {
            left,
            center,
            right,
            width,
            x,
        };
    }

    getBounds(from: string | Actor, to: string | Actor) {
        from = this.name(from);
        to = this.name(to);

        const from_bounds = this.bounds.get(from);
        const to_bounds = this.bounds.get(to);

        if (!from_bounds || !to_bounds) return undefined;
        const [fleft, _, fright] = from_bounds;
        const [tleft, __, tright] = to_bounds;

        const rtl = this.is(from)?.after(to);

        return [rtl ? fleft : fright, rtl ? tright : tleft] as [number, number];
    }

    getBoundsMult(actors: (Actor | string)[]) {
        return actors.reduce(
            (res, a) => {
                const { left = Infinity, right = -Infinity } = this.coord(a) || {};

                if (left < res[0]) res[0] = left;
                if (right > res[1]) res[1] = right;

                return res;
            },
            [Infinity, -Infinity] as [number, number]
        );
    }

    // Get all the actors within the specified range of x coordinates
    getActorsWithin(from: number, to: number) {
        return this.actors
            .filter((actor) => this.isActorWithin(actor, from, to))
            .map((actor) => this.cells.get(actor)!);
    }

    isActorWithin(actor: Actor | string, from: number, to: number) {
        actor = this.name(actor);
        const { center } = this.coord(actor)!;
        return center >= from && center <= to;
    }

    setHeights(height: number) {
        this.cells.forEach((cell) => {
            setBounds(cell, { height });
        });
    }
}
