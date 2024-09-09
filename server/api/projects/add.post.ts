import * as yup from "yup";
import { safeAwait, safeTry } from "~/utils/safeTry";

const schema = yup.object({
    id: yup.number().required(),
    projectName: yup.string().required(),
    class: yup.string().optional(),
    usecase: yup.string().optional(),
});

export default defineEventHandler(async (event) => {
    const [err, body] = await safeAwait(
        readValidatedBody(event, (body) => schema.validateSync(body))
    );

    if (err) return "Invalid Payload";

    const { projectName: name, class: cd = "", usecase = "", id } = body;
    await useDrizzle()
        .insert(tables.projects)
        .values({ class: cd, name, sequence: "", usecase, by: id });

    return true;
});
