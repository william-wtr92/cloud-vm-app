import axios from "axios"

import { VmInitialValues } from "@/utils/validators/createVmValidator"

export const scheduleVmStart = async (
  { subscriptionId, resourceGroupName, labName, vmName, jwt }: VmInitialValues,
  maxRetries: number = 10,
): Promise<void> => {
  return new Promise((resolve, reject): void => {
    let attempts: number = 0

    const interval = setInterval(async (): Promise<void> => {
      try {
        const checkIfExistUrl: string = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DevTestLab/labs/${labName}/virtualmachines/${vmName}?api-version=2018-09-15`
        const statusResponse = await axios.get(checkIfExistUrl, {
          headers: { Authorization: `Bearer ${jwt}` },
        })

        if (statusResponse.data.properties.provisioningState === "Succeeded") {
          const startUrl: string = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DevTestLab/labs/${labName}/virtualmachines/${vmName}/start?api-version=2018-09-15`

          const startResponse = await axios.post(
            startUrl,
            {},
            {
              headers: { Authorization: `Bearer ${jwt}` },
            },
          )

          if (startResponse.status === 202) {
            clearInterval(interval)
            resolve()
          }
        } else if (attempts < maxRetries) {
          attempts++
        } else {
          clearInterval(interval)
          reject(new Error("VM start failed. Please try again."))
        }
      } catch (error) {
        clearInterval(interval)
        reject(error)
      }
    }, 30000)
  })
}
