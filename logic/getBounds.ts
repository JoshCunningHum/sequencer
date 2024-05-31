import type { DIOMxCell } from "~/models/DrawIOXML";

export interface Bounds {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

export default (cell: DIOMxCell) => {
    const result: Bounds = {};

    const [geometry] = cell.elements;
    if (!geometry) return result;

    const { x, y, width, height } = geometry.attributes;
    result.x = x;
    result.y = y;
    result.width = width;
    result.height = height;

    return result;
};
