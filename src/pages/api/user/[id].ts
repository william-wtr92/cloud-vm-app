import { z } from "zod"

import mw from "@/api/middlewares/mw"
import UserModel from "@/api/models/UserModel"
import validate from "@/api/middlewares/validate"
import { getUserId } from "@/utils/types/mw.types"
import { idValidator } from "@/utils/validators/genericValidator"
import { sanitizeUser } from "@/utils/dto/userDTO"

const handler = mw({
  GET: [
    validate({
      query: z.object({
        id: idValidator,
      }),
    }),
    async ({
      locals: {
        query: { id },
      },
      res,
    }: getUserId): Promise<void> => {
      const user: UserModel | undefined = await UserModel.query()
        .findOne({ id })
        .withGraphFetched("roleData")

      if (!user) {
        res.status(404).send({ error: "User not found" })

        return
      }

      res.send({ result: await sanitizeUser(user) })
    },
  ],
})

export default handler
