export type CreateVmInitialValues = {
  jwt?: string
  osType: string
}

export interface DeleteVmInitialValues {
  subscriptionId: string
  resourceGroupName: string
  labName: string
  vmName: string
  jwt: string
}
