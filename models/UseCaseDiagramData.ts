import getBounds from "~/logic/getBounds";
import getConnects, { type CellConnection } from "~/logic/getConnects";
import isBound from "~/logic/isBound";
import getSystem from "~/logic/usecase/getSystem";
import isActor from "~/logic/usecase/isActor";
import isRelationShip from "~/logic/usecase/isRelationShip";
import isSystem from "~/logic/usecase/isSystem";
import isUseCase from "~/logic/usecase/isUseCase";
import { DrawIOXML, isMxfile, type DIODiagram, type DIOMxCell } from "./DrawIOXML";

const DEV = false;

export enum UseCaseProcessError {
    InvalidJSON = "Invalid JSON",
}

export class UseCaseDiagramData extends DrawIOXML {
    public systems: SystemData[] = [];
    public pages: UsecasePage[] = [];

    constructor(xml: string) {
        super(xml);
    }

    toPrompt(): string {
        return this.pages.map((p, i) => `${i + 1}.) ${p.toString()}`).join("\n\n");
    }

    createPath(
        usecase: DIOMxCell,
        rels: DIOMxCell[],
        usecases: DIOMxCell[],
        actors: DIOMxCell[],
        systems: DIOMxCell[],
        onActorConnect: (from: string, to: string) => void,
        onRelation: (from: string, to: string, type: UseCaseData["type"]) => void
    ) {
        const MAX_VISITS = 5;
        const visited = new Map<number, number>();
        const queue = [usecase];
        let curr: DIOMxCell | undefined;
        const objects = [...rels, ...usecases, ...actors, ...systems];

        while ((curr = queue.shift())) {
            const { x: curr_x } = getBounds(curr);
            if (!curr_x) return; // if no bounds then don't include

            const curr_system = getSystem(curr, objects);
            if (!curr_system) return; // Do not proceed when usecase is not within a system: will not happen tho

            const { x: sys_x } = getBounds(curr_system);
            if (!sys_x) return; // will not happen

            const current_id = curr.attributes.id;
            const current_value = `(${curr.attributes.value})` || "";

            const visits = visited.get(current_id) || 0;
            visited.set(current_id, visits + 1);

            if (visits >= MAX_VISITS) continue;

            // Get the ins and outs of the usecase
            const { sources, targets, ins, outs } = getConnects(curr, objects);
            const connections = sources.concat(targets);

            // Get the primary actor connecting (if any)
            connections
                .filter((c, i) => {
                    const isValidActor = actors.some((a) => a.attributes.id === c.attributes.id);
                    const { x: actor_x } = getBounds(c);
                    if (!actor_x || !isValidActor) return false;
                    return actor_x < sys_x;
                })
                .forEach((a) => onActorConnect(a.attributes.value || "", current_value));

            // Then the including cases of the current
            const includes = targets.filter((_, i) =>
                String(outs[i]!.attributes.value || "")
                    .toLowerCase()
                    .includes("include")
            );
            includes.forEach((u) =>
                onRelation(current_value, `(${u.attributes.value})`, "include")
            );
            queue.push(...includes);

            // Then follow it with the extended cases
            const extendeds = sources.filter((_, i) =>
                String(ins[i]!.attributes.value || "")
                    .toLowerCase()
                    .includes("extends")
            );
            extendeds.forEach((u) =>
                onRelation(`(${u.attributes.value})`, current_value, "extends")
            );
            queue.push(...extendeds);

            // Then proceed with the secondary actor connection
            connections
                .filter((c, i) => {
                    const isValidActor = actors.some((a) => a.attributes.id === c.attributes.id);
                    const { x: actor_x } = getBounds(c);
                    if (!actor_x || !isValidActor) return false;
                    return actor_x > sys_x;
                })
                .forEach((a) => onActorConnect(current_value, a.attributes.value || ""));
        }
    }

    process() {
        // Get the JSON
        const { elements: json } = this.json;
        // Check if valid JSON
        if (!json) throw new Error(UseCaseProcessError.InvalidJSON);
        // Check if it is a valid DrawIO JSON File
        const [mxfile] = json;
        if (!isMxfile(mxfile)) throw new Error(UseCaseProcessError.InvalidJSON);

        // basically a drawio page
        const diagrams = mxfile.elements as DIODiagram[];

        this.pages = diagrams.map((diagram, i) => {
            const cells: DIOMxCell[] = diagram.elements[0]!.elements[0]!.elements;

            const [actors, systems, usecases, rels] = [[], [], [], []] as [
                DIOMxCell[],
                DIOMxCell[],
                DIOMxCell[],
                DIOMxCell[],
            ];

            cells.forEach((c) => {
                if (isActor(c, cells)) actors.push(c);
                else if (isSystem(c, cells)) systems.push(c);
                else if (isUseCase(c, cells)) usecases.push(c);
                else if (isRelationShip(c, cells)) rels.push(c);
            });

            const actor_names = actors.map((actor) => actor.attributes.value || "");

            // Actors and usecases
            const actors_usecases = actors.concat(usecases);
            // Usecases and rels
            const usecases_rels = rels.concat(usecases);
            // Actor connections
            const actor_connects = actors.map((a) => getConnects(a, usecases_rels));

            // Get all information about a use-case system:
            // - primary and secondary actors
            // - relationships (actors->usecase, usecase->usecase)
            // - usecases
            const page_systems_data = systems.map((sys) => {
                const { x: sys_x } = getBounds(sys);
                const primary_actors: DIOMxCell[] = [];
                const secondary_actors: DIOMxCell[] = [];
                const sys_id = sys.attributes.id;
                const local_usecases = usecases.filter(
                    (usecase) =>
                        usecase.attributes.parent === sys.attributes.id || isBound(sys, usecase)
                );

                const local_rels = rels.filter((r) => {
                    const { source, target } = r.attributes;
                    return (
                        source &&
                        target &&
                        actors_usecases.some(
                            ({ attributes: { id } }) => id === source || id === target
                        )
                    );
                });

                // When a system doesn't have bounds, return empty data
                if (sys_x === undefined) {
                    return {
                        system: sys,
                        primaries: primary_actors,
                        secondaries: secondary_actors,
                        rels: local_rels,
                        usecases: local_usecases,
                    };
                }

                actors.forEach((actor) => {
                    const { x: actor_x } = getBounds(actor);

                    if (!actor_x) return;

                    // Make sure there are outgoing and ingoing of the local usecases in this system
                    const { sources, targets } = actor_connects.find(
                        (ac) => ac.id === actor.attributes.id
                    ) as CellConnection;

                    const isConnected =
                        targets.some((t) => t.attributes.parent === sys_id) ||
                        sources.some((s) => s.attributes.parent === sys_id) ||
                        targets.some((t) => isBound(sys, t)) ||
                        sources.some((s) => isBound(sys, s));

                    if (!isConnected) return;

                    if (actor_x < sys_x) primary_actors.push(actor);
                    else secondary_actors.push(actor);
                });

                return {
                    system: sys,
                    primaries: primary_actors,
                    secondaries: secondary_actors,
                    usecases: local_usecases,
                    rels: local_rels,
                };
            });

            // Process each systems to create the usecase data
            const page_data = page_systems_data.map(
                ({ system, primaries, secondaries, rels, usecases }) => {
                    const rels_usecases = rels.concat(usecases);
                    const actors = primaries.concat(secondaries);
                    const data: UseCaseData[] = [];

                    // Start from primary actors and all the usecases they are connected with
                    primaries.forEach((prim_actor) => {
                        const { targets, sources } = getConnects(prim_actor, rels_usecases);

                        const starting_usecases = targets
                            .concat(sources)
                            .filter((cell) =>
                                usecases.some(
                                    (usecase) => usecase.attributes.id === cell.attributes.id
                                )
                            );

                        starting_usecases.forEach((usecase) =>
                            this.createPath(
                                usecase,
                                rels,
                                usecases,
                                actors,
                                systems,
                                (from, to) => {
                                    data.push(new UseCaseData(from, to));
                                },
                                (from, to, type) => {
                                    data.push(new UseCaseData(from, to, type));
                                }
                            )
                        );
                    });

                    return new SystemData(system.attributes.value || "", data);
                }
            );

            return new UsecasePage(diagram.attributes.name || "", page_data, actor_names);
        });
    }
}

export class UsecasePage {
    name: string;
    actors: string[] = [];
    data: SystemData[] = [];

    constructor(name: string, data: SystemData[], actors: string[]) {
        this.name = name;
        this.data = data;
        this.actors = actors;
    }

    toString() {
        return `@startuml
title ${this.name}
left to right direction
${this.actors.map((a) => `actor ${a}`).join("\n")}${this.data.map((d) => `\n${d.toString()}`).join("\n")}
@enduml`;
    }
}

export class SystemData {
    name: string = "";
    data: UseCaseData[] = [];

    constructor(name: string, data: UseCaseData[]) {
        this.name = name;
        this.data = data;
    }

    toString() {
        const unique_data = [...new Set(this.data.map((d) => `\t${d.toString()}`))];

        return `rectangle ${this.name.split(/\s/).join("")} {\n${unique_data.join("\n")}\n}`;
    }
}

export class UseCaseData {
    from: string;
    to: string;
    type?: "include" | "extends";

    constructor(from: string, to: string, type?: UseCaseData["type"]) {
        this.from = from;
        this.to = to;
        this.type = type;
    }

    toString() {
        return `${this.from} ${this.type ? ".>" : "--"} ${this.to}${this.type ? ` : ${this.type}` : ""}`;
    }
}
