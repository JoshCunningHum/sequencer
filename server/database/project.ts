import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { users } from "./user";
import { InferSelectModel } from "drizzle-orm";

export const projects = sqliteTable("projects", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    usecase: text("usecase").notNull(),
    class: text("class").notNull(),
    sequence: text("sequence").notNull(),
    by: integer("by").references(() => users.id),
});

export type Project = InferSelectModel<typeof projects>;
