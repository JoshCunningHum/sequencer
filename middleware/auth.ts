export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser();

    if(!user.value) {
        return navigateTo('/login');
    }

    // Do what you wanna do there then
})