import { z } from "zod"

const dbConfigSchema = z.object({
  client: z.string(),
  connection: z.object({
    host: z.string(),
    user: z.string(),
    password: z.string(),
    database: z.string(),
  }),
  migrations: z.object({
    directory: z.string(),
    loadExtensions: z.array(z.string()),
    stub: z.string(),
  }),
  seeds: z.object({
    directory: z.string(),
    loadExtensions: z.array(z.string()),
  }),
})

const securityConfigSchema = z.object({
  jwt: z.object({
    secret: z.string(),
    expiresIn: z.string(),
  }),
  password: z.object({
    saltlen: z.number(),
    keylen: z.number(),
    iterations: z.number(),
    digest: z.string(),
    pepper: z.string(),
  }),
})

export const configTypes = z.object({
  port: z.number(),
  db: dbConfigSchema,
  security: securityConfigSchema,
})

export type AppConfig = z.infer<typeof configTypes>
