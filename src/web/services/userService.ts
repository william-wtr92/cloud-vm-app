import useSWR from "swr"
import { AxiosInstance } from "axios"

import apiClient from "@/web/services/utils/apiClient"

const fetcher = async (url: string) => {
  const reqInstance: AxiosInstance = apiClient(null)

  try {
    const { data } = await reqInstance.get(url)

    return data.result
  } catch (error) {
    return [Array.isArray(error) ? error : [error]]
  }
}

export const useGetUserDetail = (userId: number) => {
  const url: string = `http://localhost:3000/api/user/${userId}`
  const { data, error, isLoading } = useSWR(url, fetcher)

  return {
    userDetailData: data,
    userDetailError: error,
    userDetailLoading: isLoading,
  }
}
