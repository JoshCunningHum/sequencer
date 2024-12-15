import { createStyleValues, type DIOMxCell } from "~/models/DrawIOXML";
import { type Block } from "~/models/SequenceDiagramData";
import { BLOCK_PAD_BOT } from "./converter.plant";
import makeMXCell from "./makeMXCell";
import makeMXGeometry from "./makeMXGeometry";

interface BlockParams {
    block: Block;
    genid: () => number;
    genY: () => number;
}

export default ({ block, genid, genY }: BlockParams): DIOMxCell => {
    const y = genY();

    const geom = makeMXGeometry({
        x: 0,
        y,
        width: 0,
        height: BLOCK_PAD_BOT,
    });

    const style = createStyleValues({
        shape: "umlFrame",
        whiteSpace: "wrap",
        html: 1,
        pointerEvents: 0,
        recursiveResize: 0,
        container: 1,
        collapsible: 0,
        width: 60,
        height: 30,
    });

    const attributes = {
        id: genid(),
        value: block.type,
        style,
        parent: 1,
        vertex: 1,
    };

    const cell = makeMXCell(attributes);
    cell.elements.push(geom);

    return cell;
};
