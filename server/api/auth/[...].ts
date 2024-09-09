import { NuxtAuthHandler } from "#auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginSchema } from "~/schemas/auth";
import * as yup from "yup";

const runtime_config = useRuntimeConfig();

type SignInPayload = yup.InferType<typeof loginSchema> & {
    csrfToken: string;
    callbackUrl: string;
    json: boolean;
};

export default NuxtAuthHandler({
    secret: runtime_config.AUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    providers: [
        // @ts-expect-error You have to use .default for it to work during SSR daw
        GitHubProvider.default({
            clientId: runtime_config.public.GITHUB_CLIENT_ID,
            clientSecret: runtime_config.GITHUB_CLIENT_SECRET,
        }),

        // @ts-expect-error You have to use .default for it to work during SSR daw
        CredentialsProvider.default({
            name: "Credentials",
            async authorize(credentials: SignInPayload) {
                const { email, password } = credentials;

                const [match] = await useDrizzle()
                    .select()
                    .from(tables.users)
                    .where(eq(tables.users.email, email))
                    .limit(1);

                if (!match || match.password !== password) return null;

                return { ...match, name: match.username };
            },
        }),
    ],
});
