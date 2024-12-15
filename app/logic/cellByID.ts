import type { DIOMxCell } from "~/models/DrawIOXML";

export default (cells: DIOMxCell[], id?: number) =>
    cells.find((c) => c.attributes.id === id);
