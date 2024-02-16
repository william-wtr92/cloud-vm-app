import { z } from "zod"
import axios from "axios"
import { config } from "dotenv"

import mw from "@/api/middlewares/mw"
import validate from "@/api/middlewares/validate"
import { generateRandomString } from "@/utils/randomVmName"
import { RequestOption } from "@/utils/validators/loginValidator"
import { CreateVm } from "@/utils/types/mw.types"

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

      const url: string = `https://management.azure.com/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourceGroups/${process.env.AZURE_PROCESSING_GROUP_NAME}/providers/Microsoft.DevTestLab/labs/${process.env.AZURE_LABS_GROUP_NAME}/virtualmachines/${generateRandomString(10)}?api-version=2018-09-15`
      const data: string = JSON.stringify({
        properties: {
          size: "Standard_B1ls",
          userName: `${process.env.AZURE_VM_USERNAME}`,
          password: `${process.env.AZURE_VM_PASSWORD}`,
          labSubnetName: `${process.env.AZURE_VIRTUAL_NETWORK_NAME}Subnet`,
          labVirtualNetworkId: `/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourcegroups/${process.env.AZURE_PROCESSING_GROUP_NAME}/providers/microsoft.devtestlab/labs/${process.env.AZURE_LABS_GROUP_NAME}/virtualnetworks/${process.env.AZURE_VIRTUAL_NETWORK_NAME}`,
          galleryImageReference: {
            offer: "UbuntuServer",
            publisher: "Canonical",
            sku: "16.04-LTS",
            osType: "Linux",
            version: "Latest",
          },
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

      const response = await axios.put(url, data, options)

      return res.send({ result: response.data })
    },
  ],
})

export default handler
