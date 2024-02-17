import axios from "axios"

import { VmInitialValues } from "@/utils/validators/createVmValidator"

export const scheduleVmDeletion = async ({
  subscriptionId,
  resourceGroupName,
  labName,
  vmName,
  jwt,
}: VmInitialValues): Promise<void> => {
  setTimeout(async (): Promise<void> => {
    const url: string = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DevTestLab/labs/${labName}/virtualmachines/${vmName}?api-version=2018-09-15`

    try {
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
    } catch (error) {
      throw new Error("Deletion failed. Please try again.")
    }
  }, 600000)
}
