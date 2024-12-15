export enum TokenType {
    Title,
    Actor,
    Participant,
    Connect,
    Colon,
    Activate,
    Deactivate,
    WP, // Whitespace
    BlockStart, // alt, group, loop
    BlockContinue, // else
    BlockEnd, // end
    BEGIN, // @startuml
    STOP, // @enduml
    Note, // Use ':' for single line notes
    Delay, // ...
    Ignore, // destory,
    AutoActivate, // autoactivate
    Return, // return <label>, because of this, we should track lifeline activations

    Var, // All user data
}

export class Token {
    type: TokenType;
    value: string;

    line: number;
    lineStr: string;

    constructor(type: TokenType, value: string, ln: number, ln_str: string) {
        this.type = type;
        this.value = value;
        this.line = ln;
        this.lineStr = ln_str;
    }

    is(...types: (keyof typeof TokenType)[]): this is Token {
        return types.includes(TokenType[this.type] as keyof typeof TokenType);
    }
}

export const tokenize = (str: string, dev?: boolean) => {
    const tokens: Token[] = [];
    const block_stack: string[] = [];
    const lines = str.split("\n");

    let pointer = 0;
    let line_number = 0;

    const skip = (n: number) => {
        // Get the # of new lines within the skipped text
        line_number = str.slice(0, pointer).split("\n").length - 1;
        pointer += n;
    };

    const enters = (keyword: string) => {
        block_stack.push(keyword);
        skip(keyword.length);
    };
    const token = (type: TokenType, value: string, append = value.length) => {
        tokens.push(new Token(type, value, line_number, get_line(line_number) || ""));
        skip(append);
    };

    const get_line = (n: number) => {
        if (n < 0 || n >= lines.length) return "";
        return lines[n];
    };

    const e = (message: string) => {
        const code_section = Array(3)
            .fill(0)
            .map(
                (_, i) =>
                    `${String(line_number - i).padStart(3, " ")}| ${get_line(line_number - i)}`
            )
            .reverse()
            .join("\n");

        return new Error(`Error at line ${line_number}: ${message}\n${code_section}`);
    };

    while (pointer < str.length) {
        const rem = str.slice(pointer);

        const [word] = rem.match(/^@?([a-z]+|\-\-?\>)/i) || [];
        const [line] = rem.match(/^[a-z\-\>:]+[^\n]*/i)?.map((str) => str.trim()) || [];
        const [wp] = rem.match(/^\s+/i) || [];

        if (!word || !line) skip(wp?.length || 1);
        else {
            if (dev) console.log(tokens);

            const key = block_stack.pop();

            // Handle all statements here
            switch (key?.toLowerCase()) {
                case "startuml":
                    token(TokenType.BEGIN, key, 0);
                    break;

                case "enduml":
                    token(TokenType.STOP, key, 0);
                    break;

                case "title":
                    token(TokenType.Title, line);
                    break;

                case "actor":
                    token(TokenType.Actor, line);
                    break;

                case "participant":
                    token(TokenType.Participant, line);
                    break;

                case "-->":
                case "->":
                    // Get the sender
                    let sender = block_stack.pop();
                    let [receiver, message] = line.split(":").map((s) => s.trim());

                    if (dev) console.log(sender, receiver, message);

                    // Wrong syntax
                    if (!receiver) throw e("Invalid receiver on message statement");
                    if (!sender) throw e("Invalid sender on message statement");
                    if (!message) throw e("Invalid label on message statement");

                    token(TokenType.Var, sender, 0);
                    token(TokenType.Connect, key, 0);
                    token(TokenType.Var, receiver, 0);
                    token(TokenType.Var, message, line.length);

                    break;

                case "activate":
                    token(TokenType.Activate, line);
                    break;

                case "deactivate":
                    const actor = line;

                    const last_deactivation = tokens.findLastIndex(
                        (t) => t.is("Deactivate") && t.value === actor
                    );
                    const last_activation = tokens.findLastIndex(
                        (t) => t.is("Activate") && t.value === actor
                    );

                    // Lets remove the last deactivation
                    if (last_activation < last_deactivation && last_activation !== -1) {
                        tokens.splice(last_deactivation, 1);
                    }

                    token(TokenType.Deactivate, line);
                    break;

                case "alt":
                    token(TokenType.BlockStart, key, 0);
                    if (line) token(TokenType.Var, line); // Do not add empty conditions
                    break;

                case "loop":
                    token(TokenType.BlockStart, key, 0);
                    if (line) token(TokenType.Var, line); // Do not add empty conditions
                    break;

                case "else":
                    token(TokenType.BlockContinue, key, 0);
                    if (line) token(TokenType.Var, line); // Do not add empty conditions
                    break;

                case "end":
                    token(TokenType.BlockEnd, key, 0);
                    break;

                default:
                    if (dev) console.log(`|${word}|`);

                    // when there is no key in the block or the key is not defined as a keyword
                    // put the key in the block stack
                    if (key) block_stack.push(key);
                    enters(word);
            }
        }
    }

    if (block_stack.length && block_stack.at(-1) !== "enduml") {
        console.warn(`Unresolved keywords`, block_stack);
    }

    return tokens;
};
