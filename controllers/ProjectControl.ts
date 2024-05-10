import type { Project } from "~/types";

export class ProjectController {
    static async sync(): Promise<Project[]> {
        const supabase = useSupabase();
        const user = useSupabaseUser();

        if (!user.value)
            throw new Error("Syncing projects while not logged in");

        console.info("Syncing projects in the database...");

        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("by", user.value.id);

        if (error) throw new Error(error.message);
        return data;
    }

    static async add(name: string, dclass?: string, dusecase?: string) {
        const supabase = useSupabase();
        const user = useSupabaseUser();

        if (!user.value)
            throw new Error("Adding a project while not logged in");

        const { data, error } = await supabase
            .from("projects")
            .insert({
                by: user.value.id,
                name,
                class: dclass,
                usecase: dusecase,
            })
            .select();

        if (error) throw new Error(error.message);
        return data[0];
    }

    static async remove(id: number) {
        const supabase = useSupabase();
        const user = useSupabaseUser();

        if (!user.value)
            throw new Error("Removing a project while not logged in");

        const { error } = await supabase
            .from("projects")
            .delete()
            .eq("id", id)
            .eq("by", user.value.id);

        if (error) throw new Error(error.message);
    }

    static async update(p: Project) {
        const supabase = useSupabase();
        const user = useSupabaseUser();

        if (!user.value)
            throw new Error("Updating a project while not logged in");

        const { error } = await supabase
            .from("projects")
            .update({
                name: p.name,
                class: p.class,
                usecase: p.usecase,
            })
            .eq("id", p.id)
            .eq("by", user.value.id);

        if (error) throw new Error(error.message);
    }
}
