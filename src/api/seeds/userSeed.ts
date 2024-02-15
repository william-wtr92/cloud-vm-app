import knex, { Knex } from "knex"
import { config } from "dotenv"

import configDb from "@/api/config/configDb"
import { hashPassword } from "@/utils/hashPassword"
import { User } from "@/utils/dto/userDTO"

config()

const seed = async (): Promise<void> => {
  const db: Knex = knex(configDb.db)

  await db("user").del()

  const [predefinedPasswordHash, predefinedPasswordSalt]: string[] =
    await hashPassword("Password1234!")

  const users: User[] = [
    {
      email: "owner@gmail.com",
      firstname: "Owner",
      lastname: "Owner",
      passwordHash: predefinedPasswordHash,
      passwordSalt: predefinedPasswordSalt,
      azureTenantId: process.env.AZURE_TENANT_URL!,
      azureClientId: process.env.AZURE_CLIENT_ID!,
      azureClientSecret: process.env.AZURE_CLIENT_SECRET!,
      azureSubscriptionId: process.env.AZURE_SUBSCRIPTION_ID!,
      roleId: 1,
    },
    {
      email: "member@gmail.com",
      firstname: "Member",
      lastname: "Member",
      passwordHash: predefinedPasswordHash,
      passwordSalt: predefinedPasswordSalt,
      azureTenantId: process.env.AZURE_TENANT_URL!,
      azureClientId: process.env.AZURE_CLIENT_ID!,
      azureClientSecret: process.env.AZURE_CLIENT_SECRET!,
      azureSubscriptionId: process.env.AZURE_SUBSCRIPTION_ID!,
      roleId: 2,
    },
    {
      email: "reader@gmail.com",
      firstname: "Reader",
      lastname: "Reader",
      passwordHash: predefinedPasswordHash,
      passwordSalt: predefinedPasswordSalt,
      azureTenantId: process.env.AZURE_TENANT_URL!,
      azureClientId: process.env.AZURE_CLIENT_ID!,
      azureClientSecret: process.env.AZURE_CLIENT_SECRET!,
      azureSubscriptionId: process.env.AZURE_SUBSCRIPTION_ID!,
      roleId: 3,
    },
  ]

  await db("user").insert(users)
}

module.exports = { seed }
