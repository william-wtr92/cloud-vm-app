export interface User {
  email: string
  firstname: string
  lastname: string
  passwordHash: string
  passwordSalt: string
  azureTenantId: string
  azureClientId: string
  azureClientSecret: string
  azureSubscriptionId: string
  roleId: number
}
