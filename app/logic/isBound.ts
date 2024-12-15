import type { DIOMxCell } from "~/models/DrawIOXML";
import getBounds from "./getBounds";

export default (container: DIOMxCell, contained: DIOMxCell) => {
    const { x = 0, y = 0, width = 0, height = 0 } = getBounds(container);
    const {
        x: ux = 0,
        y: uy = 0,
        width: uw = 0,
        height: uh = 0,
    } = getBounds(contained);

    const l = x,
        r = x + width;
    const b = y,
        t = y + height;
    const ul = ux,
        ur = ux + uw;
    const ub = uy,
        ut = uy + uh;
    // check if rectangles are completely disjoint
    return !(r < ul || l > ur || b > ut || t < ub);
};
