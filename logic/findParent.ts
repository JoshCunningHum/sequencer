import type { DIOMxCell } from "~/models/DrawIOXML";

export default (cell: DIOMxCell, cells: DIOMxCell[]) => {
    const parent = cell.attributes.parent;
    return cells.find((c) => c.attributes.id === parent);
};
