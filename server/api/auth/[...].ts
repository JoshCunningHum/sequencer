import { NuxtAuthHandler } from "#auth";
import GitHubProvider from "@auth/core/providers/github";
import CredentialsProvider from "@auth/core/providers/credentials";
import { loginSchema } from "~/schemas/auth";
import * as yup from "yup";
import { AuthConfig, User } from "@auth/core/types";

const runtime_config = useRuntimeConfig();

type SignInPayload = yup.InferType<typeof loginSchema> & {
    csrfToken: string;
    callbackUrl: string;
    json: boolean;
};

export const authOptions: AuthConfig = {
    secret: runtime_config.authJs.secret,
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
};

export default NuxtAuthHandler(authOptions, runtime_config);
