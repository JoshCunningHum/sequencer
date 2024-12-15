import * as yup from "yup";
import type { QuerySchemaMeta } from "~/components/DynamicForm/types";

export const loginSchema = yup.object({
    email: yup
        .string()
        .required("Please enter your email")
        .email("Please input a valid email")
        .label("Email"),
    password: yup
        .string()
        .required("Please enter your password")
        .label("Password")
        .meta({
            type: "password",
        } as QuerySchemaMeta),
});

export const registerSchema = yup.object({
    username: yup.string().required("Username is required").label("Username"),
    email: yup
        .string()
        .required("Please enter your email")
        .email("Please input a valid email")
        .label("Email"),
    password: yup
        .string()
        .required("Please enter your password")
        .label("Password")
        .meta({
            type: "password",
        } as QuerySchemaMeta),
    confirmPassword: yup
        .string()
        .required("Please confirm the password")
        .oneOf([yup.ref("password")], "Passwords must match")
        .label("Confirm password")
        .meta({ type: "password" } as QuerySchemaMeta),
});
