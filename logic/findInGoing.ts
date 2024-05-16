import type { DIOMxCell } from "~/models/DrawIOXML";

export default (cell: DIOMxCell, cells: DIOMxCell[]) => {
    return cells.filter((c) => c.attributes.target === cell.attributes.id);
};
