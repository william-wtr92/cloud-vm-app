import { parseCookies } from "nookies"
import Axios, { AxiosInstance } from "axios"

import { Cookies } from "@/utils/validators/genericValidator"

const apiClient = (context: any) => {
  const { token }: Cookies = parseCookies(context)

  const reqInstance: AxiosInstance = Axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return reqInstance
}

export default apiClient
