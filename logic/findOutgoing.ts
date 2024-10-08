import type { DIOMxCell } from "~/models/DrawIOXML";

export default (cell: DIOMxCell, cells: DIOMxCell[]) => {
    return cells.filter((c) => c.attributes.source === cell.attributes.id);
};
