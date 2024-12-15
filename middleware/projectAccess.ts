export default defineNuxtRouteMiddleware(async (to, from) => {
    const project_id = Number(to.params.id);

    // ID check
    if (!project_id || isNaN(project_id)) return navigateTo("/dashboard");

    // Get stored user
    let { user, sync } = useUserStore();

    // If access through a link
    if (!user) {
        await sync();
        user = useUserStore().user;
    }

    // ? would probably not happen
    if (!user) return navigateTo("/login");

    const { projects } = useProjectsStore();
    if (projects.some((p) => p.id === project_id)) return; // If clicked through the dashboard

    // If accessed through a link
    const { id: user_id } = user;
    const [err, hasAccess] = await safeAwait(
        $fetch("/api/projects/access", {
            method: "POST",
            body: { projectID: project_id, userID: user_id },
        })
    );

    if (err || !hasAccess) return navigateTo("/dashboard");
});
