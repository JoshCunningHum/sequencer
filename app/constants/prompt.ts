type Options = {
    strict: boolean;
};

export const generate_sequence = (
    classdiag?: string,
    usecasediag?: string,
    options?: Partial<Options>
) => {
    const { strict = false } = options || {};

    return `Providing class diagrams and use case diagrams for an app with PlantUML syntax. Generate the sequence diagram(s) in PlantUML syntax from the given class and use cases. ${strict ? "Each use case should have its own sequence diagram and you should strictly follow the class and its methods as messages and actors in the sequence diagram. " : ""}Note you have to put a title for each UML you generate. Participants and actors should be created at the start of the sequence diagram. Please properly activate and deactivate actors and participants.
Here are the class diagram(s):
${classdiag || ""}
Here are the usecase diagram(s):
${usecasediag || ""}`;
};
