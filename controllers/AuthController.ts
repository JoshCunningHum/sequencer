import { useSupabase } from "../composables/useSupabase";
export class AuthController {
    public static async SignIn(
        email: string,
        password: string
    ): Promise<Error | boolean> {
        const supabase = useSupabase();

        const result = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (result.error) return new Error(result.error.message);
        return true;
    }

    public static async SignInOAuth(
        provider: "github" | "google"
    ): Promise<boolean | Error> {
        const supabase = useSupabase();
        const location = useBrowserLocation();

        const { error, data } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: location.value.origin,
            },
        });

        if (error) return new Error(error.message);
        return true;
    }

    public static async SignUp(
        email: string,
        password: string,
        full_name: string
    ): Promise<Error | boolean> {
        const supabase = useSupabase();

        const result = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name } },
        });

        if (result.error) return new Error(result.error.message);
        return true;
    }

    public static async LogOut() {
        const supabase = useSupabase();
        await supabase.auth.signOut();
    }
}
