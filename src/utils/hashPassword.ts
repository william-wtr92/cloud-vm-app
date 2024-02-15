import { pbkdf2 as pbkdf2Callback, randomBytes } from "crypto"
import { promisify } from "util"
import configDb from "@/api/config/configDb"

const pbkdf2 = promisify(pbkdf2Callback)

export const hashPassword = async (
  password: string,
  salt: string = randomBytes(configDb.security.password.saltlen).toString(
    "hex",
  ),
): Promise<[string, string]> => {
  const key: Buffer = await pbkdf2(
    `${password}${configDb.security.password.pepper}`,
    salt,
    configDb.security.password.iterations,
    configDb.security.password.keylen,
    configDb.security.password.digest,
  )

  return [key.toString("hex"), salt]
}
