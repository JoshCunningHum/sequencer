import type { DIOMxfile } from "~/models/DrawIOXML";

export default (file: DIOMxfile) => {
    const [diagram] = file.elements;
    const [graphmodel] = diagram.elements;
    const [root] = graphmodel.elements;
    return root.elements;
};
