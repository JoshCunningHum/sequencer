import type { DIOMxCell } from "~/models/DrawIOXML";
import type { Bounds } from "./getBounds";

export default (cell: DIOMxCell, { height, width, x, y }: Bounds) => {
    const [geom] = cell.elements;

    if (!geom) return;

    if (x) geom.attributes.x = x;
    if (y) geom.attributes.y = y;
    if (width) geom.attributes.width = width;
    if (height) geom.attributes.height = height;
};
