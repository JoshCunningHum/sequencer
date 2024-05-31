// Create tests for the converter object

import { expect, test } from "vitest";
import { parse } from "./parser";
import { ConvertUtil, convert } from "./converter";
import type { SequenceDiagramData } from "~/models/SequenceDiagramData";
import type { DIOMxCell } from "~/models/DrawIOXML";
import getCells from "../getCells";
import makeMXCell from "./makeMXCell";
import createActor from "./createActor";

const _ = makeMXCell({ id: 0 });
const rootcell = makeMXCell({ id: 1, parent: 0 });

test("Actor Test", () => {
    const prompt = `Participants:\nUser Server LLM API Database`;
    const parsed = parse(prompt);
    const [jsoned] = convert(parsed).elements;

    const cells = getCells(jsoned);

    ConvertUtil.reset();

    const expected: DIOMxCell[] = [
        _,
        rootcell,
        ..."User Server LLM API Database"
            .split(" ")
            .map((actor, i) => createActor({ value: actor, index: i })),
    ];

    expect(cells).toStrictEqual(expected);
});
