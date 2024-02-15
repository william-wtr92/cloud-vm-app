import { z } from "zod"
import * as yup from "yup"

export const emailValidator: z.ZodString = z
  .string()
  .email()
  .min(1, "Email is required")

export const passwordValidator: z.ZodString = z
  .string()
  .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
  .regex(new RegExp(".*[a-z].*"), "One lowercase character")
  .regex(new RegExp(".*\\d.*"), "One number")
  .regex(
    new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
    "One special character",
  )
  .min(8, "Must be at least 8 characters in length")

export const loginValidator = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
})

export type LoginInitialValues = {
  email: string
  password: string
}
