import type { DIODiagram } from "../../models/DrawIOXML";

export default ({
    id = "",
    name = "Page-1",
}: Partial<DIODiagram["attributes"]> = {}): DIODiagram => ({
    attributes: {
        name,
        id,
    },
    elements: [],
    name: "diagram",
    type: "element",
});
