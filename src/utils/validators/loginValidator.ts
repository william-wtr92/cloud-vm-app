import { z } from "zod"

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

export type AzureEncodeUrl = {
  grant_type: string
  client_id: string
  client_secret: string
  scope: string
}

export type RequestOption = {
  headers: {
    "Content-Type": string
  }
}

export const loginValidator = z.object({
  email: emailValidator,
  password: passwordValidator,
})

export type LoginInitialValues = {
  email: string
  password: string
}
