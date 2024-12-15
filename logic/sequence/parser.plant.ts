import {
    isSequenceBlock,
    type Activation,
    type Actor,
    type Block,
    type Message,
    type SequenceElement,
    type SequencePage,
} from "~/models/SequenceDiagramData";
import { Token, tokenize, TokenType } from "./lexer.plant";

export class PlantUMLParser {
    dev?: boolean;

    //#region Internal Properties
    str: string;
    tokens: Token[];
    activations: Map<string, Activation> = new Map();
    prevMsg?: Message;
    index: number = 0;

    //#region Result Properties
    actors: Actor[] = [];
    title: string = "";
    elements: SequenceElement[] = [];
    messages: Message[] = [];

    //#region Entry Point
    static Parse(text: string, dev?: boolean) {
        // extract @startuml groups
        const pattern = /@startuml([\s\S]*?)@enduml/g;
        let match;

        const result: SequencePage[] = [];

        while ((match = pattern.exec(text)) !== null) {
            if (dev) console.log(`%cParsing page...`, "color:orange");
            const uml = match[0]!;
            const parser = new PlantUMLParser(uml, dev);
            result.push(parser.parse());
        }

        return result;
    }

    // Should only support strings starting with '@startuml' and ends with '@enduml'
    constructor(str: string, dev?: boolean) {
        this.str = str;
        this.tokens = tokenize(str);

        this.dev = dev;
    }

    //#region Utils

    add(element?: SequenceElement) {
        if (element) this.elements.push(element);
    }

    consume<T extends number | undefined = undefined>(
        n?: T
    ): T extends number ? Token[] : Token | undefined {
        this.log(
            `consume: ${n || 1} item${n ? "s" : ""} = [${this.range(n || 1).map((v) => v.value)}]`
        );

        this.index += n || 1;

        if (!n) {
            return this.tokens.at(this.index - 1) as any;
        } else {
            return this.tokens.slice(this.index - n, this.index) as any;
        }
    }

    get current() {
        return this.at(0);
    }

    at(n: number) {
        return this.tokens.at(this.index + n);
    }

    range(start: number, amount?: number) {
        if (amount === undefined) {
            amount = start;
            start = this.index;
        }
        return this.tokens.slice(start, start + amount);
    }

    //#region Debug Utils

    log(...params: any[]) {
        if (this.dev) console.log(...params);
    }

    get lines() {
        return this.str.split("\n");
    }

    get_line(n: number) {
        if (n < 0 || n >= this.lines.length) return "";
        return this.lines[n];
    }

    e(token: Token, msg: string) {
        const line_number = token.line;

        const code_section = Array(3)
            .fill(0)
            .map(
                (_, i) =>
                    `${String(line_number - i).padStart(3, " ")}| ${this.get_line(line_number - i)}`
            )
            .reverse()
            .join("\n");

        return new Error(`Error at line ${line_number}: ${msg}\n${code_section}`);
    }

    throw(error: Error) {
        console.log(`Parsing details: `, this.tokens, this.prevMsg, this.actors, this.activations);
        throw error;
    }

    warn(token: Token, msg: string, requiresDev?: boolean) {
        const e = this.e(token, msg);
        if (!requiresDev || this.dev) console.warn(e.message);
    }

    //#region Main Loop

    parse() {
        this.index = 0;

        while (this.current) {
            const current = this.current;
            this.log(`parse: ${TokenType[current.type]}[${current.value}]`);

            const type = TokenType[current.type] as keyof typeof TokenType;
            const value = current.value;

            switch (type) {
                case "Title":
                    this.title = value;
                    this.consume();
                    break;

                case "Actor":
                case "Participant":
                    this.actors.push({
                        name: value,
                        participant: current.is("Participant"),
                        token: current,
                    });
                    this.consume();
                    break;
                // Ignorables
                case "BEGIN":
                case "STOP":
                    this.consume();
                    break;
                default:
                    const stmt = this.parseStatement();
                    if (!!stmt && isSequenceBlock(stmt) && stmt.type === "block") {
                        this.warn(current, `Continuation block without parent block`);
                        break; // Do not add items of 'else' blocks
                    }
                    this.add(stmt);
            }
        }

        return {
            actors: this.actors,
            elements: this.elements,
            name: this.title,
            messages: this.messages,
        } satisfies SequencePage;
    }

    //#region Parse Functions
    parseStatement(): Message | Activation | Block | undefined {
        const current = this.current!;
        const type = TokenType[current.type] as keyof typeof TokenType;
        const value = current.value;

        this.log(`parseStatemnt: ${type}[${value}]`);

        switch (type) {
            case "Var":
                const msg = this.parseMessage();
                if (msg) return msg;
                break;
            case "Activate":
            case "Deactivate":
                const act = type === "Activate" ? this.parseActivation() : this.endActivation();
                if (act) return act;
                break;
            case "BlockStart":
                if (value === "alt") return this.parseAlt();
                if (value === "loop") return this.parseLoop();
                break;
            case "BlockContinue":
                if (value === "else") return this.parseElse();
            default:
                this.throw(this.e(current, "Unknown statement"));
        }

        return undefined;
    }

    parseLoop() {
        // Reuse the else block
        const block = this.parseElse() as Block;
        block.type = "loop";
        block.parent = undefined;

        // consume end
        this.consume();

        return block;
    }

    parseElse() {
        this.consume(); // consume else
        const [first, second] = this.range(2);
        let condition;

        // Make sure that the next token is not the sendder of a message statement
        if (first?.is("Var") && !second?.is("Connect")) {
            this.consume();
            condition = first.value;
        }

        const statements: SequenceElement[] = [];

        const block: Block = {
            conditions: condition ? [condition] : [],
            elements: statements,
            type: "block",
            parent: {} as any, // set on the parseAlt func
        };

        // Get all statements inside the block
        while (this.current && !this.current.is("BlockEnd", "BlockContinue")) {
            // Stop when encountering 'end' or another 'else'
            const stmt = this.parseStatement();
            if (stmt) {
                if (isSequenceBlock(stmt)) stmt.parent = block;
                statements.push(stmt);
            }
        }

        return block;
    }

    parseAlt() {
        this.consume(); // consumes 'alt'
        const [first, second] = this.range(2);
        const conditions: string[] = [];
        const block: Block = {
            conditions: [],
            elements: [],
            type: "block",
            parent: {} as any,
        };
        const blocks: Block[] = [block];

        // make sure that the next token is not the sender of a message statement
        if (first?.is("Var") && !second?.is("Connect")) {
            this.consume();
            conditions.push(first.value);
        }

        // Get all the statements inside the if block
        while (this.current && !this.current.is("BlockEnd")) {
            const stmt = this.parseStatement();
            if (stmt) {
                // Check if the statement is a block
                if (isSequenceBlock(stmt)) {
                    stmt.parent = block;
                    // If statement is a part of the current alt block (e.g. else)
                    if (stmt.type === "block") {
                        blocks.push(stmt);
                        conditions.push(...stmt.conditions);
                    } else block.elements.push(stmt);
                } else block.elements.push(stmt);
            }
        }

        const altBlock: Block = {
            conditions,
            elements: blocks,
            type: "alt",
        };

        // set all blocks with their parent as the current alt block
        blocks.forEach((b, i) => {
            b.parent = altBlock;
            b.conditions.push(conditions[i] || "");
        });

        // consume 'end'
        this.consume();

        return altBlock;
    }

    parseMessage() {
        const sender = this.consume()!;
        const [conn, receiver, content] = this.consume(3);

        const isMessage = conn?.is("Connect") && receiver?.is("Var") && content?.is("Var");
        if (!isMessage) return undefined;

        // Check for un-documented actors
        const sender_actor = this.actors.find((a) => a.name === sender.value);
        const receiver_actor = this.actors.find((a) => a.name === receiver.value);

        if (!sender_actor) {
            const token = new Token(TokenType.Actor, sender.value, -1, "---NOT FOUND IN PROMPT---");
            this.actors.push({ name: sender.value, participant: true, token });
        }
        if (!receiver_actor) {
            const token = new Token(TokenType.Actor, sender.value, -1, "---NOT FOUND IN PROMPT");
            this.actors.push({ name: receiver.value, participant: true, token });
        }

        const isAsync = conn.value.includes("-->");
        const msg: Message = {
            sender: sender.value,
            receiver: receiver.value,
            content: content.value,
            type: isAsync ? "async" : "sync",
            token: sender,
        };

        this.messages.push(msg);

        this.log(`parseMessage: ${sender.lineStr}`, msg);

        // Register it as the last message (for acctivations)
        this.prevMsg = msg;

        return msg;
    }

    parseActivation() {
        const current = this.consume()!;
        const actor = current.value;
        const lastmsg = this.prevMsg;

        if (!lastmsg)
            this.throw(this.e(current, `Activation of actor[${actor}] but no messages yet`));

        const activation: Activation = { actor, type: "start" };

        this.activations.set(actor, activation);
        return activation;
    }

    endActivation() {
        // This does not mutate the elements, just adds the ending element
        const current = this.consume()!;
        const actor = current.value;
        const lastmsg = this.prevMsg;

        const activation = this.activations.get(actor);
        if (!activation) {
            this.warn(current, `Deactivation of actor[${actor}] without activating it`);
            return;
        }

        if (!lastmsg)
            this.throw(
                this.e(current, `Deactivation of actor[${actor}] without reference message`)
            );

        // this.activations.delete(actor);
        const end_activation: Activation = { actor, type: "end" };

        return { actor, type: "end" } satisfies Activation;
    }
}
