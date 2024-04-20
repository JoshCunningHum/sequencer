export default defineNuxtRouteMiddleware(() => {
    const user = useSupabaseUser();

    if(user.value) {
        return navigateTo('/dashboard');
    }

    // Do what you wanna do there then
})