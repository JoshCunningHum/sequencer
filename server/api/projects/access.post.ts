import * as yup from "yup";
import { safeAwait } from "~/utils/safeTry";

const schema = yup.object({
    projectID: yup.number().required(),
    userID: yup.number().required(),
});

export default defineEventHandler(async (event): Promise<boolean> => {
    const [err, body] = await safeAwait(
        readValidatedBody(event, (body) => schema.validateSync(body))
    );

    if (err) return false;
    const { projectID, userID } = body;

    const [match] = await useDrizzle()
        .select()
        .from(tables.projects)
        .where(and(eq(tables.projects.by, userID), eq(tables.projects.id, projectID)));

    return !!match;
});
