import type { DIODiagram } from "../../models/DrawIOXML";

export default ({
    id = "",
    name = "Page-1",
}: Partial<DIODiagram["attributes"]> = {}): DIODiagram => ({
    attributes: {
        name,
        id,
    },
    // @ts-expect-error will put an element on this later
    elements: [],
    name: "diagram",
    type: "element",
});
