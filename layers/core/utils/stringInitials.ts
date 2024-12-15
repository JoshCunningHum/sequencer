export default (str?: string) =>
    str
        ?.split(/\s+/i)
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase() || "";
