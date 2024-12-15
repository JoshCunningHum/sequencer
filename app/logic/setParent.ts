import type { DIOMxCell } from "~/models/DrawIOXML";

export default (parent: DIOMxCell, ...children: DIOMxCell[]) =>
    children.forEach(
        (child) => (child.attributes.parent = parent.attributes.id)
    );
