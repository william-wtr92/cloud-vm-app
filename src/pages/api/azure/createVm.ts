import { z } from "zod"
import axios from "axios"
import { config } from "dotenv"

import mw from "@/api/middlewares/mw"
import validate from "@/api/middlewares/validate"
import { generateRandomString } from "@/utils/randomVmName"
import { RequestOption } from "@/utils/validators/loginValidator"
import { CreateVm } from "@/utils/types/mw.types"
import { scheduleVmDeletion } from "@/utils/scheduleVmDeletion"
import {
  Credentials,
  ImageReferences,
  osImageReferences,
  VmInitialValues,
} from "@/utils/validators/createVmValidator"
import { scheduleVmStart } from "@/utils/scheduleVmStart"
import { pwdVmGenerator } from "@/utils/pwdVmGenerator"

config()

const handler = mw({
  PUT: [
    validate({
      body: z.object({
        osType: z.string(),
      }),
    }),
    async ({
      locals: {
        body: { osType },
      },
      req,
      res,
    }: CreateVm) => {
      const formatToken = req.headers.authorization?.slice(7)
      const osConfig: ImageReferences = osImageReferences[osType]

      const vmPassword: string = pwdVmGenerator()

      const url: string = `https://management.azure.com/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourceGroups/${process.env.AZURE_PROCESSING_GROUP_NAME}/providers/Microsoft.DevTestLab/labs/${process.env.AZURE_LABS_GROUP_NAME}/virtualmachines/${generateRandomString(10)}?api-version=2018-09-15`
      const data: string = JSON.stringify({
        properties: {
          size: "Standard_B1ls",
          userName: `${process.env.AZURE_VM_USERNAME}`,
          password: vmPassword,
          labSubnetName: `${process.env.AZURE_VIRTUAL_NETWORK_NAME}Subnet`,
          labVirtualNetworkId: `/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourcegroups/${process.env.AZURE_PROCESSING_GROUP_NAME}/providers/microsoft.devtestlab/labs/${process.env.AZURE_LABS_GROUP_NAME}/virtualnetworks/${process.env.AZURE_VIRTUAL_NETWORK_NAME}`,
          galleryImageReference: osConfig,
          allowClaim: true,
          storageType: "Standard",
        },
        location: "francecentral",
        tags: {
          tagName1: "tagValue1",
        },
      })
      const options: RequestOption = {
        headers: {
          Authorization: `Bearer ${formatToken}`,
          "Content-Type": "application/json",
        },
      }

      try {
        const response = await axios.put(url, data, options)

        const credentials: Credentials = {
          username: process.env.AZURE_VM_USERNAME!,
          password: vmPassword,
          ip: `${response.data.name}.${response.data.location}.cloudapp.azure.com`,
        }

        const vmData: VmInitialValues = {
          subscriptionId: process.env.AZURE_SUBSCRIPTION_ID!,
          resourceGroupName: process.env.AZURE_PROCESSING_GROUP_NAME!,
          labName: process.env.AZURE_LABS_GROUP_NAME!,
          vmName: response.data.name,
          jwt: formatToken,
        }

        scheduleVmStart(vmData)
        await scheduleVmDeletion(vmData)

        return res.send({ result: { vm: response.data, credentials } })
      } catch (error) {
        return res
          .status(500)
          .send({ error: "VM creation failed. Please try again." })
      }
    },
  ],
})

export default handler
