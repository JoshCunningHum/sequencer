import * as yup from "yup";
import { safeAwait } from "~/utils/safeTry";

const schema = yup.object({
    user_id: yup.number().required(),
});

export default defineEventHandler(async (event) => {
    const [err, body] = await safeAwait(
        readValidatedBody(event, (body) => schema.validateSync(body))
    );
    const project_id = Number(getRouterParam(event, "id"));
    if (err || !body) return false;

    // Also compare creator to (mostly)avoid csrf attack on project deletion (waw naman)
    const deleted = await useDrizzle()
        .delete(tables.projects)
        .where(and(eq(tables.projects.id, project_id), eq(tables.projects.by, body.user_id)))
        .returning();

    // Only return true when there is an actual project deleted
    return !!deleted.length;
});
