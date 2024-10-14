import type { ClassPage } from "~/models/ClassDiagramData";
import type { SequencePage } from "~/models/SequenceDiagramData";

export enum ValidationErrorType {
    NonExistingMethod,
    MethodCalledOnWrongActor,
    ActorNotAClass,
}

export interface ValidationError {
    type: ValidationErrorType;
    description: string;
    code_reference: string;
    line_number: number;
    page: string;
}

const withinArrayBounds = (index: number, array: any[]) => {
    return Math.max(0, Math.min(index, array.length - 1));
};

export const validateSequence = (data: SequencePage[], basis: ClassPage[], prompt: string) => {
    const classes = basis.flatMap((c) => c.data);
    const lines = prompt.split("\n");

    const errors: ValidationError[] = [];

    const add = (err: ValidationError) => errors.push(err);
    const codeBlock = (line: number) => {
        return Array(3)
            .fill(0)
            .map((_, i) => {
                const l = withinArrayBounds(line - (i - 1), lines);
                return lines[l];
            })
            .join("\n");
    };

    // Handle by pages
    data.forEach(({ messages, actors, name: page }) => {
        // Check for actor validity
        actors.forEach(({ name: actor, token }) => {
            const line_number = token.line;
            const does_exist = classes.some((c) => c.name === actor);
            const code_reference = line_number !== -1 ? codeBlock(line_number) : token.lineStr;

            if (!does_exist) {
                const description = `Actor: "${actor}" not found in class diagram`;
                add({
                    type: ValidationErrorType.ActorNotAClass,
                    code_reference,
                    description,
                    line_number,
                    page,
                });
                return;
            }
        });

        // Check for message method validity
        messages.forEach(({ content: method, token, sender }) => {
            const line_number = token.line;
            const code_reference = codeBlock(line_number);

            // Check if method is existing
            const does_exist = classes.some((c) => c.properties.includes(method));

            if (!does_exist) {
                const description = `Method: "${method}" not found in class diagram`;
                add({
                    type: ValidationErrorType.NonExistingMethod,
                    description,
                    line_number,
                    code_reference,
                    page,
                });
                return;
            }

            const origin = classes.find((c) => c.name === sender);
            if (!origin) return; // Handled in the previous section

            // Check if method is called in the right class definition
            const does_follow_schema = origin.properties.includes(method);
            if (!does_follow_schema) {
                const description = `Class: ${origin.name} does not have a property "${method}"`;
                add({
                    type: ValidationErrorType.MethodCalledOnWrongActor,
                    page,
                    code_reference,
                    line_number,
                    description,
                });
                return;
            }
        });
    });

    return errors;
};
