import type { DIOMxfile } from "~/models/DrawIOXML";

export default ({
    host = "embed.diagrams.net",
    modified = new Date().toISOString(),
    agent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0`,
    etag = genid(20),
    version = "24.4.10",
    type = "embed",
}: Partial<DIOMxfile["attributes"]> = {}): DIOMxfile => ({
    attributes: {
        host,
        modified,
        agent,
        etag,
        version,
        type,
    },
    elements: [],
    name: "mxfile",
    type: "element",
});
