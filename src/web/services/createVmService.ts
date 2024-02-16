import axios from "axios"
import { CreateVmInitialValues } from "@/utils/validators/createVmValidator"
import { RequestOption } from "@/utils/validators/loginValidator"

const createVmService = async (values: CreateVmInitialValues) => {
  const url: string = "http://localhost:3000/api/azure/createVm"
  const body: CreateVmInitialValues = {
    osType: values.osType,
  }
  const config: RequestOption = {
    headers: {
      Authorization: `Bearer ${values.jwt}`,
      "Content-Type": "application/json",
    },
  }

  try {
    const {
      data: { result },
    } = await axios.put(url, body, config)

    return [result, true]
  } catch (error) {
    return [Array.isArray(error) ? error : [error]]
  }
}

export default createVmService
