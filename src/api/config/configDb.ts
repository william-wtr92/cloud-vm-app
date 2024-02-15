import { config } from "dotenv"
import { AppConfig, configTypes } from "./configDb.types"

config()

const configDb: AppConfig = configTypes.parse({
  port: 3000,
  db: {
    client: "pg",
    connection: {
      host: process.env.DB_CONNECTION_HOST!,
      user: process.env.DB_CONNECTION_USER!,
      password: process.env.DB_CONNECTION_PWD!,
      database: process.env.DB_CONNECTION_DB!,
    },
    migrations: {
      directory: "./src/api/migrations",
      loadExtensions: [".ts"],
      stub: "./src/api/migration.stub",
    },
    seeds: {
      directory: "./src/api/seeds",
      loadExtensions: [".ts"],
    },
  },
  security: {
    jwt: {
      secret: process.env.SECURITY_JWT_SECRET!,
      expiresIn: "1 day",
    },
    password: {
      saltlen: 512,
      keylen: 512,
      iterations: 10000,
      digest: "sha512",
      pepper: process.env.SECURITY_PASSWORD_PEPPER!,
    },
  },
})

export default configDb
