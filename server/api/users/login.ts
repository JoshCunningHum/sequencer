import { useDrizzle } from "../../utils/drizzle";
import * as tables from "../../database/schema";
import { loginSchema } from "~/schemas/auth";

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => loginSchema.validateSync(body));
    if (!body) throw createError({ statusCode: 400, message: "Invalid Payload" });

    const [result] = await useDrizzle()
        .select()
        .from(tables.users)
        .where(eq(tables.users.email, body.email))
        .limit(1);

    if (!result || result.password !== body.password)
        throw createError({ statusCode: 401, statusMessage: "Invalid Credentials" });

    return result;
});
