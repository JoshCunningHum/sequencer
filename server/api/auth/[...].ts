import { NuxtAuthHandler } from "#auth";
import { skipCSRFCheck } from "@auth/core";
import CredentialsProvider from "@auth/core/providers/credentials";
import GitHubProvider from "@auth/core/providers/github";
import { AuthConfig, User } from "@auth/core/types";
import * as yup from "yup";
import { loginSchema } from "~/schemas/auth";

const runtime_config = useRuntimeConfig();

type SignInPayload = yup.InferType<typeof loginSchema> & {
    csrfToken: string;
    callbackUrl: string;
    json: boolean;
};

export const authOptions: AuthConfig = {
    secret: runtime_config.authJs.secret,
    pages: {
        signIn: "/login",
    },
    providers: [
        GitHubProvider({
            clientId: runtime_config.github.clientId,
            clientSecret: runtime_config.github.clientSecret,
        }),

        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials) {
                const { email, password } = credentials as SignInPayload;

                const [match] = await useDrizzle()
                    .select()
                    .from(tables.users)
                    .where(eq(tables.users.email, email))
                    .limit(1);

                if (!match || match.password !== password) return null;

                return { ...match, name: match.username, id: String(match.id) } as User;
            },
        }),
    ],
    skipCSRFCheck,
};

export default NuxtAuthHandler(authOptions, runtime_config);
