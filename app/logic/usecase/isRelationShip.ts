import { extractStyleValues, type DIOMxCell } from "~/models/DrawIOXML";
import isActor from "./isActor";
import isUseCase from "./isUseCase";

export default (cell: DIOMxCell, cells: DIOMxCell[]): boolean => {
    // const styles = extractStyleValues(cell.attributes.style);
    const from = cell.attributes.source;
    const to = cell.attributes.target;

    if (!from || !to) return false;

    // Check if from and to is an actor/usecase
    const source = cells.find((c) => c.attributes.id === from);
    const target = cells.find((c) => c.attributes.id === to);

    if (!source || !target) return false;

    const isSourceActor = isActor(source, cells);
    const isTargetActor = isActor(target, cells);
    const isSourceUseCase = isUseCase(source, cells);
    const isTargetUseCase = isUseCase(target, cells);

    if (!isSourceActor && !isSourceUseCase) return false;
    if (!isTargetActor && !isTargetUseCase) return false;

    return true;
};
