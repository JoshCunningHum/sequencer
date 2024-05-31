import type { DIOMxCell } from "~/models/DrawIOXML";

interface SetConnectParams {
    mode?: "sync" | "async";
    value: string;
}

export default (
    from: DIOMxCell,
    to: DIOMxCell,
    { mode = "sync" }: SetConnectParams
) => {};
