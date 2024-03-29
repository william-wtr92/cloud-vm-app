import Axios from "axios"
import { setCookie } from "nookies"

import { LoginInitialValues } from "@/utils/validators/loginValidator"

const loginService = async (values: LoginInitialValues) => {
  const url: string = "http://localhost:3000/api/login"
  const body: LoginInitialValues = {
    email: values.email,
    password: values.password,
  }

  try {
    const {
      data: { result },
    } = await Axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    setCookie(null, "token", result.jwt, {
      maxAge: 3600,
      path: "/",
    })

    setCookie(null, "azure_token", result.azure_token, {
      maxAge: 3600,
      path: "/",
    })

    return [null, true]
  } catch (error) {
    return [Array.isArray(error) ? error : [error]]
  }
}

export default loginService
