import * as yup from "yup";
import { safeAwait } from "~/utils/safeTry";

const schema = yup.object({
    user_id: yup.number().required(),
    class: yup.string().optional(),
    usecase: yup.string().optional(),
    sequence: yup.string().optional(),
    name: yup.string().optional(),
});

export default defineEventHandler(async (event) => {
    const [err, body] = await safeAwait(
        readValidatedBody(event, (body) => schema.validateSync(body))
    );
    const project_id = Number(getRouterParam(event, "id"));
    if (err || !body) return false;

    // Get if project exists and check if user id passed is the creator
    const [project] = await useDrizzle()
        .select()
        .from(tables.projects)
        .where(eq(tables.projects.id, project_id));
    if (!project || project.by !== body.user_id) return false;

    const { class: c, sequence, usecase, name } = body;

    // Update the project
    await useDrizzle()
        .update(tables.projects)
        .set({ class: c, sequence, usecase, name })
        .where(eq(tables.projects.id, project_id));

    return true;
});
