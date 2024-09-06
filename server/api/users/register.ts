import { count } from "drizzle-orm";
import { registerSchema } from "~/schemas/auth";

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => registerSchema.validateSync(body));

    if (!body) throw createError({ statusCode: 400, message: "Invalid Payload" });

    const { email, password, username } = body;
    // Check first if said user exists
    const users = await useDrizzle()
        .select({ id: tables.users.id })
        .from(tables.users)
        .where(eq(tables.users.email, email));

    if (users.length)
        throw createError({
            statusCode: 409,
            message: `Email already used`,
            statusMessage: "Email already used",
        });

    await useDrizzle().insert(tables.users).values({ email, password, username });

    return true;
});
