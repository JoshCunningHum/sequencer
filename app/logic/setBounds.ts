import type { DIOMxCell, DIOMxGeometry } from "~/models/DrawIOXML";
import type { Bounds } from "./getBounds";

export default (
    cell: DIOMxCell | DIOMxGeometry,
    { height, width, x, y, relative }: Bounds
) => {
    const [geom] = cell.name === "mxGeometry" ? [cell] : cell.elements;

    if (!geom) return;

    if (x !== undefined) geom.attributes.x = x;
    if (y !== undefined) geom.attributes.y = y;
    if (width !== undefined) geom.attributes.width = width;
    if (height !== undefined) geom.attributes.height = height;
    if (relative !== undefined) geom.attributes.relative = 1;
};
