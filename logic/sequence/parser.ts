import type {
    Block,
    Message,
    SequenceElement,
} from "~/models/SequenceDiagramData";

export const getline = (str: string, index: number) => {
    return str.slice(0, index).split("\n").length;
};

const isparticipantline = (line: string) => {
    return !line.match(/(\-?\->|alt|opt|par\s|loop|block|end|else|\|\|)/gi);
};

export const parse = (
    str: string
): { actors: string[]; title: string; elements: SequenceElement[] } => {
    const lines = str.split("\n");

    console.log(`%c----Starting parsing----`, "color:cyan");

    let title = "";
    const actors: string[] = [];
    const elements: SequenceElement[] = [];

    let currentblock: Block | null = null;

    for (let i = 0; i < str.length; i++) {
        const slice = str.slice(i);

        const whitespacematch = slice.match(/^\s+/);
        const titlematch = slice.match(/^Sequence:\s*[a-z]+\n/i);
        const participantsmatch = slice.match(/^Participants:/i);
        const messagematch = slice.match(
            /^[ \t]*[a-z0-9]+[ ]*\-?\->[ ]*[a-z0-9]+:[ ]*[a-z0-9]+\n?/i
        );
        const blockmatch = slice.match(
            /^[ \t]*(alt|opt|par|loop)([ ]+[a-z0-9]*)?\n/i
        );
        const endblock = slice.match(/^[ \t]*end/i);
        const elseblock = slice.match(/^[ \t]*else([ ]+[a-z0-9]*)?\n/i);
        const paritem = slice.match(/^\|\|/i);

        if (whitespacematch) {
            // Whitespaces
            i += whitespacematch.length - 1;
            continue;
        } else if (titlematch) {
            // Title
            const [match] = titlematch;
            i += match.length - 1;
            title = match.split(":")[1].trim();
            continue;
        } else if (participantsmatch) {
            // Participants
            i += participantsmatch[0].length;
            do {
                const line = lines[getline(str, i)];
                const participantline = isparticipantline(line);
                if (!participantline) break;

                const extracted_actors = line
                    .split(/[\s\n\t]+/gm)
                    .map((act) => act.trim())
                    .filter((act) => !!act && act.length > 0);

                actors.push(...extracted_actors);

                i += line.length;
            } while (true);
            i--;
        } else if (messagematch) {
            // Messages
            const [match] = messagematch;
            const isasync = match.includes("-->");
            const [ps, msg] = match.split(":");
            const [p1, p2] = ps.split(/\-?\->/i);

            const message: Message = {
                content: msg.trim(),
                type: isasync ? "async" : "sync",
                sender: p1.trim(),
                receiver: p2.trim(),
            };

            if (currentblock) {
                const curr = currentblock as Block;
                curr.elements.push(message);
            } else {
                elements.push(message);
            }

            i += match.length - 1;
        } else if (blockmatch) {
            const [type, condition] = blockmatch[0].trim().split(/\s+/);

            console.log(`%cEncountered block ${type}`, "color:amber");

            const block: Block = {
                type: type as Block["type"],
                elements: [],
                conditions: condition ? [condition.trim()] : [],
            };

            if (currentblock) {
                const curr = currentblock as Block;
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

            i += blockmatch[0].length - 1;
        } else if (elseblock) {
            const [match] = elseblock;
            const condition = match.replace(/(else\s|if\s)/gim, "").trim();

            // the current block here is the block that contains all things in the previous condition
            if (currentblock) {
                const curr = currentblock as Block;
                if (
                    !curr.parent ||
                    curr.parent.type !== "alt" ||
                    !curr.parent.conditions
                )
                    throw new Error(`Condition block with no alt parent block`);

                curr.parent.conditions.push(condition);
                console.log(curr.parent.conditions);

                console.log(
                    `Adding a new condition to alt block: ${condition}`
                );
                if (curr.type === "block") {
                    const elseblock: Block = {
                        type: "block",
                        conditions: [],
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
            if (currentblock) {
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

                            console.log(
                                `%cEnding block ${parent.type}`,
                                "color:amber"
                            );

                            if (parent.parent) {
                                console.log(`<< Back to ${parent.parent.type}`);
                                currentblock = parent.parent;
                            } else {
                                elements.push(parent);
                                currentblock = null;
                            }
                            break;
                        case "loop":
                        case "opt":
                            console.log(
                                `%cEnding block ${block.type}`,
                                "color:amber"
                            );
                            currentblock = block.parent;
                            break;
                    }
                } else {
                    elements.push(block);
                    currentblock = null;
                }
            } else throw new Error(`End block with no starting block`);
            const [match] = endblock;
            i += match.length - 1;
        }
    }

    return {
        title,
        actors,
        elements,
    };
};
