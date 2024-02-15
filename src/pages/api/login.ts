import jsonwebtoken from "jsonwebtoken"
import { z } from "zod"

import mw from "@/api/middlewares/mw"
import { InvalidCredentialsError } from "@/utils/errors"
import UserModel from "@/api/models/UserModel"
import validate from "@/api/middlewares/validate"
import configDb from "@/api/config/configDb"
import {
  emailValidator,
  passwordValidator,
} from "@/utils/validators/loginValidator"
import { Login } from "@/utils/types/mw.types"

const handler = mw({
  POST: [
    validate({
      body: z.object({
        email: emailValidator,
        password: passwordValidator,
      }),
    }),
    async ({
      locals: {
        body: { email, password },
      },
      res,
    }: Login): Promise<void> => {
      const user: UserModel | undefined = await UserModel.query()
        .findOne({ email })
        .withGraphFetched("roleData")

      const validity: boolean | undefined = await user?.checkPassword(password)

      if (!user || !validity) {
        throw new InvalidCredentialsError()
      }

      const jwt: string = jsonwebtoken.sign(
        {
          payload: {
            user: {
              id: user.id,
              email: user.email,
              role: user.roleData.right,
            },
          },
        },
        configDb.security.jwt.secret,
        { expiresIn: configDb.security.jwt.expiresIn },
      )

      res.send({ result: jwt })
    },
  ],
})

export default handler
