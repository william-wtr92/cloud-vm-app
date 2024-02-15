import knex, { Knex } from "knex"

import configDb from "@/api/config/configDb"
import { hashPassword } from "@/utils/hashPassword"
import { User } from "@/utils/dto/userDTO"

const seed = async (): Promise<void> => {
  const db: Knex = knex(configDb.db)

  await db("user").del()

  const [predefinedPasswordHash, predefinedPasswordSalt]: string[] =
    await hashPassword("Password1234!")

  const users: User = {
    email: "test@gmail.com",
    firstname: "Test",
    lastname: "Test",
    passwordHash: predefinedPasswordHash,
    passwordSalt: predefinedPasswordSalt,
    roleId: 1,
  }

  await db("user").insert(users)
}

module.exports = { seed }
