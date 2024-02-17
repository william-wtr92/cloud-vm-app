export type CreateVmInitialValues = {
  jwt?: string
  osType: string
}

export interface VmInitialValues {
  subscriptionId: string
  resourceGroupName: string
  labName: string
  vmName: string
  jwt: string
}
