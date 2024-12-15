import type { Activation, Block, Message, SequenceElement } from "~/models/SequenceDiagramData";

export const getline = (str: string, index: number) => {
    return str.slice(0, index).split("\n").length;
};

const isparticipantline = (line: string) => {
    if (!line) return false;
    return (
        !line.match(/(\-?\->|alt|opt|par\s|loop|block|end|else|\|\|)/gi) &&
        !!line.match(/[a-z0-9]+/gi)
    );
};

const DEV = false;

export const parse = (
    str: string
): { actors: string[]; title: string; elements: SequenceElement[] } => {
    const lines = str.split("\n");
    const longestline = lines.reduce((longest, line) => Math.max(longest, line.length), 0);

    let title = "";
    const actors: string[] = [];
    const elements: SequenceElement[] = [];

    let currentblock: Block | null = null;

    let lastelement: SequenceElement | null = null;

    const activations: Activation[] = [];

    let PREVENTLOOP = str.length * 2;
    let lastline = "";

    for (let i = 0; i < str.length; i++) {
        const slice = str.slice(i);

        PREVENTLOOP--;

        if (PREVENTLOOP <= 0) {
            throw new Error(`Infinite Loop Detected. This is a code error and not a user error`);
        }

        const line = getline(str, i);
        const linestr = lines[line - 1];
        const displayline = () => `${line}| ${linestr}`;

        const whitespacematch = slice.match(/^\s+/);
        const titlematch = slice.match(/^Sequence:\s*[a-z_]+\n/i);
        const participantsmatch = slice.match(/^Participants:/i);
        const messagematch = slice.match(
            /^[ \t]*[a-z0-9_]+[ ]*\-?\->[ ]*[a-z0-9_]+:[ ]*[a-z0-9_ ]+\n?/i
        );
        const blockmatch = slice.match(/^[ \t]*(alt|opt|par|loop)([ ]+[a-z0-9_ ]*)?\n/i);
        const endblock = slice.match(/^[ \t]*end/i);
        const elseblock = slice.match(/^[ \t]*else([ ]+[a-z0-9_ ]*)?\n/i);
        const paritem = slice.match(/^\|\|/i);
        const acts = slice.match(/^[ \t]*(de)?activate[ ]*[a-z0-9_]+/i);

        if (
            DEV &&
            (titlematch ||
                participantsmatch ||
                messagematch ||
                blockmatch ||
                endblock ||
                elseblock ||
                paritem ||
                acts)
        ) {
            const txt = displayline();
            lastline = txt;
            console.log(
                txt +
                    `${" ".repeat(longestline + 10 - txt.length)}${!!whitespacematch ? "w" : ""}${!!titlematch ? "t" : ""}${!!participantsmatch ? "p" : ""}${!!messagematch ? "m" : ""}${!!blockmatch ? "b" : ""}${!!endblock ? "n" : ""}${!!elseblock ? "e" : ""}${!!paritem ? "r" : ""}${!!acts ? "a" : ""}`
            );
        }

        if (whitespacematch) {
            //#region Whitespaces
            // Whitespaces
            i += whitespacematch.length - 1;
            continue;
        } else if (titlematch) {
            //#region Title
            const [match] = titlematch;
            i += match.length - 1;
            title = match.split(":")[1]!.trim();
            continue;
        } else if (participantsmatch && !acts) {
            if (DEV) console.log(`-------- Encountered Participants --------`);

            //#region Participants
            i += participantsmatch[0].length;
            do {
                const line = lines[getline(str, i)]!;
                const participantline = isparticipantline(line);
                if (!participantline) break;

                PREVENTLOOP--;
                if (PREVENTLOOP <= 0) {
                    throw new Error(`Infinite Loop Detected in Participant Check`);
                }

                const extracted_actors = line
                    .split(/[\s\n\t]+/gm)
                    .map((act) => act.trim())
                    .filter((act) => !!act && act.length > 0);

                if (DEV) console.log(`Got: `, extracted_actors);

                actors.push(...extracted_actors);

                i += line.length;
            } while (true);
        } else if (messagematch) {
            //#region Messages
            const [match] = messagematch;
            const isasync = match.includes("-->");
            const [ps, msg] = match.split(":");
            const [p1, p2] = ps!.split(/\-?\->/i);

            const message: Message = {
                content: msg!.trim(),
                type: isasync ? "async" : "sync",
                sender: p1!.trim(),
                receiver: p2!.trim(),
            };

            if (currentblock) {
                const curr = currentblock;
                curr.elements.push(message);
            } else {
                elements.push(message);
            }

            lastelement = message;

            i += match.length - 1;
        } else if (blockmatch) {
            //#region Blocks
            const [type, ...conditiontxt] = blockmatch[0].trim().split(/\s+/);
            const condition = conditiontxt.join(" ");

            const block: Block = {
                type: type as "alt" | "opt" | "par" | "loop",
                elements: [],
                conditions: condition ? [condition.trim()] : [],
            };

            if (currentblock) {
                const curr = currentblock;
                curr.elements.push(block);
                block.parent = currentblock;
            }

            currentblock = block;

            // Check for alt conditions where we put a regular block to the alt block itself
            if (type === "alt" || type === "par") {
                const containerblock: Block = {
                    type: "block",
                    conditions: [],
                    elements: [],
                    parent: block,
                };
                block.elements.push(containerblock);
                currentblock = containerblock;
            }

            if (DEV) console.log(`-------- Encountered [${type}] block --------`);

            i += blockmatch[0].length - 1;
        } else if (elseblock) {
            //#region Else Blocks
            const [match] = elseblock;
            const condition = match.replace(/(else\s|if\s)/gim, "").trim();

            if (DEV) console.log(`-------- Encountered [else] block --------`);

            // the current block here is the block that contains all things in the previous condition
            if (currentblock) {
                const curr = currentblock as Block;
                if (!curr.parent || curr.parent.type !== "alt" || !curr.parent.conditions)
                    throw new Error(`Condition block with no alt parent block`);

                curr.parent.conditions.push(condition);

                if (curr.type === "block") {
                    const elseblock: Block = {
                        type: "block",
                        conditions: [condition],
                        elements: [],
                        parent: curr.parent,
                    };
                    curr.parent.elements.push(elseblock);
                    currentblock = elseblock;
                } else
                    throw new Error(
                        `Alt condition block is not found when doing an else block. Instead found a ${curr.type}`
                    );
            } else throw new Error(`Else block with no alt start`);

            i += match.length - 1;
        } else if (paritem) {
            //#region Parallel Blocks
            const [match] = paritem;

            if (currentblock) {
                const curr = currentblock as Block;
                if (curr.type === "block") {
                    const block: Block = {
                        type: "block",
                        conditions: [],
                        elements: [],
                        parent: curr.parent,
                    };
                    curr.parent?.elements.push(block);
                    currentblock = block;
                } else {
                    throw new Error(
                        `Parrallel Task block is not found when adding a parallel task to a par block`
                    );
                }
            }

            i += match.length - 1;
        } else if (endblock) {
            //#region End Statements
            const dpline = displayline();
            if (currentblock !== null) {
                const [match] = endblock;
                i += match.length - 1;
                const block = currentblock as Block;

                if (block.parent) {
                    switch (block.type) {
                        case "par":
                        case "alt": // Not possible
                            throw new Error(
                                `Encountered an ${block.type} block without getting the regular block type for its condition block`
                            );
                            break;
                        case "block":
                            const parent = block.parent as Block;

                            if (parent.parent) {
                                currentblock = parent.parent;
                            } else {
                                elements.push(parent);
                                currentblock = null;
                            }
                            break;
                        case "loop":
                        case "opt":
                            currentblock = block.parent;
                            break;
                    }
                } else {
                    elements.push(block);
                    currentblock = null;
                }
            } else {
                throw new Error(`End block with no starting block: ${dpline}`);
            }
        } else if (acts) {
            //#region Activations
            const [match] = acts;
            const [command, actor] = match.trim().split(/\s+/) as [string, string];
            const isactivate = command === "activate";
            const existing_participant = actors.includes(actor);

            const last_activation_index = activations.findIndex((a) => a.actor === actor);
            const last_activation =
                last_activation_index === -1 ? undefined : activations[last_activation_index];

            if (existing_participant && lastelement) {
                if (isactivate) {
                    if (last_activation) {
                        console.warn(
                            `Activation of actor[${actor}] is activated without de-activation of a previous one`
                        );
                        continue;
                    }

                    const activation: Activation = {
                        actor,
                        start: lastelement,
                    };
                    activations.push(activation);
                    elements.push(activation);
                } else {
                    if (!last_activation)
                        throw new Error(
                            `De-activation of actor[${actor}] occured without activating`
                        );
                    last_activation.end = lastelement;
                    activations.splice(last_activation_index, 1);
                }
            } else if (lastelement) {
                console.warn(`Activation but no actor is found: ${actor}`);
                continue;
            } else throw new Error(`Activation but no message happened yet: ${match}`);

            i += match.length - 1;
        }
    }

    return {
        title,
        actors,
        elements,
    };
};
