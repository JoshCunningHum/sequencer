import * as yup from "yup";

export const login_schema = yup.object({
    email: yup
        .string()
        .required("Please enter your email")
        .email("Please input a valid email")
        .label("Email"),
    password: yup
        .string()
        .required("Please enter your password")
        .label("Password")
        .meta({ type: "password" }),
});

export const register_schema = yup.object({
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
        .meta({ type: "password" }),
    confirmPassword: yup
        .string()
        .required("Please confirm the password")
        .oneOf([yup.ref("password")], "Passwords must match")
        .label("Confirm password")
        .meta({ type: "password" }),
});
