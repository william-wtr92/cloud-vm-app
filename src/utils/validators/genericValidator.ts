import { z } from "zod"

export const idValidator = z.string()

export interface Cookies {
  [key: string]: string
}
