import isActor from "~/logic/usecase/isActor";
import { DrawIOXML, isMxfile, type DIOMxCell } from "./DrawIOXML";
import isSystem from "~/logic/usecase/isSystem";
import isUseCase from "~/logic/usecase/isUseCase";
import isRelationShip from "~/logic/usecase/isRelationShip";
import getBounds from "~/logic/getBounds";
import findInGoing from "~/logic/findInGoing";
import findOutgoing from "~/logic/findOutgoing";
import getConnects, { type CellConnection } from "~/logic/getConnects";
import cellByID from "~/logic/cellByID";

export enum UseCaseProcessError {
    InvalidJSON = "Invalid JSON",
}

export const usecase_default = useDrawIOUseCaseDefault();

export class UseCaseDiagramData extends DrawIOXML {
    public systems: SystemData[] = [];

    constructor(xml: string) {
        super(xml);
    }

    toPrompt(): string {
        const countStepGroups = (input: string) => {
            let skip = 0;
            return input.split("").reduce((groups, c, i) => {
                if (skip > 0) {
                    skip--;
                    return groups;
                }

                const slice = input.slice(i);
                const digitmatch = slice.match(/^[0-9]+/i);
                const charmatch = slice.match(/^[A-Za-z]+/i);

                if (digitmatch) {
                    const [match] = digitmatch;
                    skip = match.length - 1;
                    groups++;
                } else if (charmatch) {
                    const [match] = charmatch;
                    skip = match.length - 1;
                    groups++;
                }

                return groups;
            }, 0);
        };

        const appendStep = (step: string, increment = 1) => {
            const matches = step.match(/([^a-z]?[0-9]+|[^0-9]?[a-z]+)$/i);
            if (!matches) return step;

            const s = matches[0];
            const rest = step.slice(0, -s.length);
            const isNumber = !isNaN(Number(s));
            const current_step = isNumber
                ? rest + String(Number(s) + increment)
                : rest + appendStringOrdinal(s, increment);

            return current_step;
        };

        const traverse = (
            u: UseCaseData,
            cb: (
                u: UseCaseData,
                step: string,
                level: number,
                category: "include" | "extend",
                type: "include" | "extend"
            ) => void,
            step = "1"
        ) => {
            type QueueItem = [
                UseCaseData,
                string,
                "include" | "extend",
                "include" | "extend",
                "include" | "extend",
            ];

            // Do the breadfirst approach
            const stack: QueueItem[] = [
                [u, step, "include", "include", "include"],
            ];
            const visited: QueueItem[] = [];

            while (stack.length) {
                const [curr, step, category, type, prev] =
                    stack.pop() as QueueItem;

                // Get the step
                const matches = step.match(
                    /([^a-z]?[0-9\-]+|[^0-9]?[a-z\-]+)$/i
                );
                if (!matches) continue;

                const s = matches[0];
                const rest = step.slice(0, -s.length);
                const isNumber = !isNaN(Number(s));
                const current_step = isNumber
                    ? rest + String(Number(s) + 1)
                    : rest + appendStringOrdinal(s);
                const alt_step = isNumber ? step + "a" : step + "1";
                const level = countStepGroups(current_step);

                console.log(current_step, level);

                // Add the includes in the qeueue
                curr.incl.forEach((u, i) => {
                    const nstep = type === "extend" ? alt_step : current_step;
                    stack.push([u, nstep, category, "include", type]);
                });

                // Then add the extended
                curr.exts.forEach((u) => {
                    stack.push([u, alt_step, "extend", "extend", type]);
                });

                // Call the callback
                cb(curr, step, level, category, type);

                visited.push([u, step, category, type, prev]);
            }
        };

        return this.systems
            .map((s) => {
                const { data, name } = s;

                console.log(`%c---Generating Prompt: ${name}---`, "color:cyan");

                const usecases = data.map((u, i) => {
                    const title = `(${u.value})`;

                    // console.log(
                    //     `%cProcessing Usecase: ${i + 1}`,
                    //     "color:orange"
                    // );

                    let stpstr = `\tSteps:\n`;
                    let extstr = `\tExtensions:\n`;
                    let hasext = false;
                    const actors = new Set<string>();

                    traverse(u, (curr, step, lvl, category, type) => {
                        const { involves, value } = curr;

                        // console.log(
                        //     `\t%c<<${category}>>: ${value}`,
                        //     "color:green"
                        // );
                        // Get actors involved in this usecase
                        involves.forEach((a) => actors.add(a));

                        const padd = "\t".repeat(
                            lvl + (category === "include" ? 1 : 0)
                        );
                        const item = `${padd}${step}. ${value} ${involves.length ? `(${involves.join(", ")})` : ""}`;

                        switch (category) {
                            case "extend":
                                hasext = true;
                                extstr += item;
                                extstr += "\n";
                                break;
                            case "include":
                                stpstr += item;
                                stpstr += "\n";
                                break;
                        }
                    });

                    const actstr = `\tActors: ${Array.from(actors).join(", ")}`;

                    return `${title}\n${actstr}\n${stpstr}${hasext ? extstr : ""}`;
                });

                return `System: ${name}\n\n${usecases.join("\n")}`;
            })
            .join("\n");
    }
    process() {
        // Get the JSON
        const { elements: json } = this.json;
        // Check if valid JSON
        if (!json) throw new Error(UseCaseProcessError.InvalidJSON);
        // Check if it is a valid DrawIO JSON File
        const [mxfile] = json;
        if (!isMxfile(mxfile)) throw new Error(UseCaseProcessError.InvalidJSON);

        // TODO: Add multipage support
        const diagram = mxfile.elements[0];

        const cells: DIOMxCell[] = diagram.elements[0].elements[0].elements;

        const actors = cells.filter((c) => isActor(c, cells));
        const systems = cells.filter((c) => isSystem(c, cells));
        const useCases = cells.filter((c) => isUseCase(c, systems));
        const rels = cells.filter((c) =>
            isRelationShip(c, [...useCases, ...systems, ...actors])
        );

        const actor_connects = actors.map((a) =>
            getConnects(a, rels.concat(useCases))
        );

        const data = systems.map((s) => {
            const { x } = getBounds(s);
            const primaries: DIOMxCell[] = [];
            const secondaries: DIOMxCell[] = [];
            const sysid = s.attributes.id;
            const localusecases = useCases.filter(
                (u) => u.attributes.parent === s.attributes.id
            );

            const localrels = rels.filter((r) => {
                const source = cellByID(useCases, r.attributes.source);
                const target = cellByID(useCases, r.attributes.target);
                return (
                    source?.attributes.parent === sysid ||
                    target?.attributes.parent === sysid
                );
            });

            if (x === undefined) {
                return {
                    system: s,
                    primaries,
                    secondaries,
                    rels: localrels,
                    usecases: localusecases,
                };
            }

            primaries.push(
                ...actors.filter((a) => {
                    const { x: ax } = getBounds(a);

                    if (ax === undefined) return false;

                    // Make sure there are outgoings and ingoings of the local usescases in this system
                    const { sources, targets } = actor_connects.find(
                        (ac) => ac.id === a.attributes.id
                    ) as CellConnection;

                    const isConnected =
                        targets.some((t) => t.attributes.parent === sysid) ||
                        sources.some((s) => s.attributes.parent === sysid);

                    return ax < x && isConnected;
                })
            );

            secondaries.push(
                ...actors.filter((a) => {
                    const { x: ax } = getBounds(a);
                    if (!ax) return false;

                    // Make sure there are outgoings and ingoings of the local usescases in this system
                    const { sources, targets } = actor_connects.find(
                        (ac) => ac.id === a.attributes.id
                    ) as CellConnection;

                    const isConnected =
                        targets.some((t) => t.attributes.parent === sysid) ||
                        sources.some((s) => s.attributes.parent === sysid);

                    return ax > x && isConnected;
                })
            );

            return {
                system: s,
                primaries,
                secondaries,
                usecases: localusecases,
                rels: localrels,
            };
        });

        const MAX_VISITS = 5;
        const visitedmap = new Map<number, number>();

        const createpath = (
            uc: DIOMxCell,
            rs: DIOMxCell[],
            ucs: DIOMxCell[],
            acts: DIOMxCell[]
        ): UseCaseData | undefined => {
            const visits = visitedmap.get(uc.attributes.id) || 0;
            visitedmap.set(uc.attributes.id, visits + 1);

            if (visits >= MAX_VISITS) return undefined;

            // Get the ins and outs of the usecase
            const { sources, targets, ins, outs } = getConnects(uc, [
                ...rs,
                ...ucs,
                ...acts,
            ]);

            // Get the involving actors first
            const involves = sources
                .concat(targets)
                .filter((c) =>
                    actors.some((a) => a.attributes.id === c.attributes.id)
                )
                .map((a) => a.attributes.value || "");

            // Get the included targets
            const includes = targets.filter((r, i) =>
                String(outs[i].attributes.value || "")
                    .toLowerCase()
                    .includes("include")
            );

            // Get the extended targets
            const extendeds = sources.filter((r, i) =>
                String(ins[i].attributes.value || "")
                    .toLowerCase()
                    .includes("extend")
            );

            // Proccess each includes
            const incl = includes
                .map((u) => createpath(u, rs, ucs, acts))
                .filter<UseCaseData>((v): v is UseCaseData => v !== undefined);
            const exts = extendeds
                .map((u) => createpath(u, rs, ucs, acts))
                .filter<UseCaseData>((v): v is UseCaseData => v !== undefined);

            return <UseCaseData>{
                value: uc.attributes.value || "",
                exts,
                incl,
                involves,
            };
        };

        // Process the data to create the use case data
        data.forEach(
            (
                {
                    primaries: p,
                    secondaries: s,
                    usecases: u,
                    system: sys,
                    rels: r,
                },
                i
            ) => {
                // TODO: Add multi system support
                if (i !== 0) return;

                // Generate UseCase data starting from primary actors
                const usecases = p.flatMap((a) => {
                    // Loop through all the usecases of this actor
                    const { targets, sources } = getConnects(a, [...r, ...u]);

                    const ucs = targets
                        .concat(sources)
                        .filter((uc) =>
                            u.some(
                                (uscs) =>
                                    uscs.attributes.id === uc.attributes.id
                            )
                        );

                    const paths = ucs
                        .map((uc) => createpath(uc, r, u, [...p, ...s]))
                        .filter<UseCaseData>(
                            (v): v is UseCaseData => v !== undefined
                        );

                    return paths;
                });

                this.systems.push({
                    name: sys.attributes.value || "",
                    data: usecases,
                });
            }
        );
    }
}

export class SystemData {
    name: string = "";
    data: UseCaseData[] = [];
}

export class UseCaseData {
    value: string = "";
    involves: string[] = []; // For Actors
    incl: UseCaseData[] = [];
    exts: UseCaseData[] = [];
}
