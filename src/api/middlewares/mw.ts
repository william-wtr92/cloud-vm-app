import { NextApiRequest, NextApiResponse } from "next"
import deepmerge from "deepmerge"
import knex, { Knex } from "knex"

import { MethodHandlers } from "@/utils/types/mw.types"
import BaseModel from "@/api/models/BaseModel"
import configDb from "@/api/config/configDb"

const db: Knex = knex(configDb.db)
BaseModel.knex(db)

const mw =
  (methodHandlers: MethodHandlers) =>
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const methodHandler = methodHandlers[req.method!]

    if (!methodHandler) {
      res.status(405).send({ error: "method not allowed" })

      return
    }

    const handlers = Array.isArray(methodHandler)
      ? methodHandler
      : [methodHandler]

    let handlerIndex: number = 0
    const locals = {}

    const ctx = {
      db,
      req,
      res,
      get locals() {
        return locals
      },
      set locals(newLocals) {
        Object.assign(locals, deepmerge(locals, newLocals))
      },
      next: async (): Promise<void> => {
        const handler = handlers[handlerIndex]
        handlerIndex += 1

        await handler(ctx)
      },
    }

    await ctx.next()
  }

export default mw
