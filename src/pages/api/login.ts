import jsonwebtoken from "jsonwebtoken"
import { z } from "zod"
import axios from "axios"
import qs from "qs"
import { config } from "dotenv"

import mw from "@/api/middlewares/mw"
import { InvalidCredentialsError } from "@/utils/errors"
import UserModel from "@/api/models/UserModel"
import validate from "@/api/middlewares/validate"
import configDb from "@/api/config/configDb"
import {
  AzureEncodeUrl,
  emailValidator,
  passwordValidator,
  RequestOption,
} from "@/utils/validators/loginValidator"
import { Login } from "@/utils/types/mw.types"

config()

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

      // Azure generated token
      const config: AzureEncodeUrl = {
        grant_type: "client_credentials",
        client_id: process.env.AZURE_CLIENT_ID!,
        client_secret: process.env.AZURE_CLIENT_SECRET!,
        scope: "https://management.azure.com/.default",
      }

      const url: string = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_URL}/oauth2/v2.0/token`
      const data: string = qs.stringify(config)
      const options: RequestOption = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }

      let azureToken: string = ""

      const response = await axios.post(url, data, options)
      azureToken = response.data.access_token

      if (azureToken.length === 0) {
        throw new Error("Azure token not found")
      }

      res.send({ result: { jwt, azure_token: azureToken } })
    },
  ],
})

export default handler
