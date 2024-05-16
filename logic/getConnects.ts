import type { DIOMxCell } from "~/models/DrawIOXML";
import findOutgoing from "./findOutgoing";
import findInGoing from "./findInGoing";

export type CellConnection = {
    id: number;
    outs: DIOMxCell[];
    ins: DIOMxCell[];
    sources: DIOMxCell[];
    targets: DIOMxCell[];
};

export default (cell: DIOMxCell, cells: DIOMxCell[]): CellConnection => {
    const outs = findOutgoing(cell, cells);
    const ins = findInGoing(cell, cells);
    const targets = outs
        .map(
            (o) =>
                cells.find(
                    (c) => c.attributes.id === o.attributes.target
                ) as DIOMxCell
        )
        .filter((c) => !!c);
    const sources = ins
        .map(
            (i) =>
                cells.find(
                    (c) => c.attributes.id === i.attributes.source
                ) as DIOMxCell
        )
        .filter((c) => !!c);

    return {
        id: cell.attributes.id,
        outs,
        ins,
        targets,
        sources,
    };
};
