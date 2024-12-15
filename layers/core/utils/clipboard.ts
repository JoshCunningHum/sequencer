export default async (text: string) => {
    const [err] = await safeAwait(navigator.clipboard.writeText(text));
    if (err) console.log("Failed to copy: ", err);
};
