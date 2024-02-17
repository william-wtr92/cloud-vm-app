import axios from "axios"

import { VmInitialValues } from "@/utils/validators/createVmValidator"

export const scheduleVmStart = ({
  subscriptionId,
  resourceGroupName,
  labName,
  vmName,
  jwt,
}: VmInitialValues): void => {
  const maxRetries: number = 40
  const attemptStart = async (attempts: number = 0): Promise<void> => {
    if (attempts >= maxRetries) {
      throw new Error("Failed to start the VM")
    }

    try {
      const checkIfExistUrl: string = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DevTestLab/labs/${labName}/virtualmachines/${vmName}?api-version=2018-09-15`
      const statusResponse = await axios.get(checkIfExistUrl, {
        headers: { Authorization: `Bearer ${jwt}` },
      })

      if (statusResponse.data.properties.provisioningState === "Succeeded") {
        const startUrl: string = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DevTestLab/labs/${labName}/virtualmachines/${vmName}/start?api-version=2018-09-15`
        await axios.post(
          startUrl,
          {},
          { headers: { Authorization: `Bearer ${jwt}` } },
        )
      } else {
        setTimeout(() => attemptStart(attempts + 1), 30000)
      }
    } catch (error) {
      setTimeout(() => attemptStart(attempts + 1), 30000)
    }
  }

  attemptStart()
}
