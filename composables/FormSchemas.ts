import * as Yup from "yup";
import { object, string, type InferType } from "yup"

export const LoginSchema = object({
    email: string()
        .min(2, 'Atleast 2 characters')
        .max(50, 'Why are you doin that?')
        .email()
        .required('Email is required'),
    password: string()
        .max(50, 'Why are you doin that?')
        .min(6, 'Minimum of 6 characters')
        .required('Password is required')
  })

export type LoginSchemaType = InferType<typeof LoginSchema>;

export const RegisterSchema = object({
    username: Yup.string()
        .required('Username is required')
        .min(2, 'Atleast 2 characters')
        .required('Name is required')
        .max(50, 'Why you doin that?'),
    email: Yup.string()
        .email()
        .required('Email is required'),
    password: Yup.string()
        .required('Please confirm password')
        .min(6, 'Minimum of 6 characters')
        .required('Password is required')
        .max(50, 'Why you doin that?'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), ''], 'Passwords must match')
        .max(50, 'Why you doin that?')
})

export type RegisterSchemaType = InferType<typeof RegisterSchema>; 