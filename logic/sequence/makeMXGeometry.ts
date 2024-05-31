import type { DIOMxGeometry } from "~/models/DrawIOXML";

export default ({
    as = "geometry",
    height = 1,
    width = 1,
    x,
    y,
}: Partial<DIOMxGeometry["attributes"]>): DIOMxGeometry => ({
    attributes: {
        x,
        y,
        width,
        height,
        as,
    },
    elements: [],
    name: "mxGeometry",
    type: "element",
});
