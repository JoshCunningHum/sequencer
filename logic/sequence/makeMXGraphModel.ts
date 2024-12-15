import type { DIOMxGraphModel } from "~/models/DrawIOXML";

export default ({
    dx = 2175,
    dy = 1703,
    grid = 1,
    gridSize = 10,
    guides = 1,
    tooltips = 1,
    connect = 1,
    arrows = 1,
    fold = 1,
    page = 1,
    pageScale = 1,
    pageWidth = 850,
    pageHeight = 1100,
    math = 0,
    shadow = 0,
}: Partial<DIOMxGraphModel["attributes"]>): DIOMxGraphModel => ({
    attributes: {
        dx,
        dy,
        grid,
        gridSize,
        guides,
        tooltips,
        connect,
        arrows,
        fold,
        page,
        pageScale,
        pageWidth,
        pageHeight,
        math,
        shadow,
    },
    elements: [
        {
            name: "root",
            //@ts-ignore
            elements: [],
            type: "element",
        },
    ],
    name: "mxGraphModel",
    type: "element",
});
