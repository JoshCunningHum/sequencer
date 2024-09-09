export default defineNuxtRouteMiddleware(async (to, from) => {
    // get if to is the path
    const project_id = Number(to.params.id);

    if (!project_id || isNaN(project_id)) return navigateTo("/dashboard");

    // check if the current user has access to this id
    const headers = useRequestHeaders(["cookie"]) as HeadersInit;
    const { id: user_id } = (await $fetch("/api/me", { method: "GET", headers })) || {};
    const [err, hasAccess] = await safeAwait(
        $fetch("/api/projects/acess", {
            method: "POST",
            body: { projectID: project_id, userID: user_id },
        })
    );

    if (err || !hasAccess) return navigateTo("/dashboard");
});
