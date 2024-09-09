import * as yup from "yup";

const schema = yup.object({
    id: yup.number().optional(),
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => schema.validateSync(body));
    const { id } = body;
    return await useDrizzle()
        .select()
        .from(tables.projects)
        .where(eq(tables.projects.by, id || -1));
});
