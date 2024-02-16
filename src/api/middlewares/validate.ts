import { z } from "zod"
import { InvalidNewPasswordError, NotFoundError } from "@/utils/errors"
import { NextApiRequest, NextApiResponse } from "next"

interface MyNextApiRequest extends NextApiRequest {
  params: { [key: string]: string }
}

interface Ctx {
  req: MyNextApiRequest
  res: NextApiResponse
  // eslint-disable-next-line @typescript-eslint/ban-types
  next: Function
  locals: any
}

const validate = ({
  body,
  params,
  query,
}: {
  body?: z.ZodType<any, any>
  params?: z.ZodType<any, any>
  query?: z.ZodType<any, any>
}) => {
  return async (ctx: Ctx) => {
    const { req, res, next } = ctx

    let validator = z.object({
      params: params ?? z.object({}).optional(),
      query: query ?? z.object({}).passthrough(),
    })

    if (["POST", "PUT", "PATCH"].includes(req.method?.toUpperCase() ?? "")) {
      validator = validator.extend({
        body: body ?? z.object({}).passthrough(),
      })
    }

    try {
      ctx.locals = await validator.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      })

      await next()
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(422).json({ error: err.errors })

        return
      }

      if (err instanceof NotFoundError) {
        res.status(404).json({ error: err.message })

        return
      }

      if (err instanceof InvalidNewPasswordError) {
        res.status(422).json({ error: err.message })

        return
      }

      res.status(500).json({ error: "Oops. Something went wrong." })
    }
  }
}

export default validate
