import { migrate } from "drizzle-orm/d1/migrator";
import { useDrizzle } from "../utils/drizzle";
import { consola } from "consola";

export default defineNitroPlugin(() => {
    if (!import.meta.dev) return;

    onHubReady(async () => {
        await migrate(useDrizzle(), { migrationsFolder: "server/database/migrations" })
            .then(() => consola.success("Database migrations done"))
            .catch((err) => consola.error("Database migrations failed", err));
    });
});
