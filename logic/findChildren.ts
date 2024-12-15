import type { DIOMxCell } from "~/models/DrawIOXML";

export default (cell: DIOMxCell, cells: DIOMxCell[]) => {
    const id = cell.attributes.id;
    return cells.filter((c) => c.attributes.parent === id);
};
