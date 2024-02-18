import { z } from "zod"

export const idValidator = z.string()

export interface Cookies {
  [key: string]: string
}

export interface VMCard {
  id: number
  name: string
  image: string
  alt: string
  status: string
  osType: string
}
