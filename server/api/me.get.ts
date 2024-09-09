import { getServerSession } from "#auth";
import { users } from "../database/user";

export default eventHandler(async (event) => {
    const session = await getServerSession(event);

    if (!session) return { status: "unauthenticated" };

    const [user] = await useDrizzle()
        .select()
        .from(tables.users)
        .where(eq(tables.users.email, session.user?.email || ""));

    if (!user && !!session.user) {
        const { email, name } = session.user;

        // Try to add the user in the user list
        const [{ id }] = await useDrizzle()
            .insert(tables.users)
            .values({
                email: email || "",
                username: name || "",
                password: "",
            })
            .returning({ id: users.id });

        return { email: email || "", id };
    }

    return { email: user.email, id: user.id };
});
