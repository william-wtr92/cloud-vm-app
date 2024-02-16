import UserModel from "@/api/models/UserModel"

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

interface UserSanitized {
  email?: string
  firstname?: string
  lastname?: string
  azureTenantId?: string
  azureClientId?: string
  azureClientSecret?: string
  azureSubscriptionId?: string
  roleName?: string
}

export const sanitizeUser = (user: UserModel | undefined): UserSanitized => {
  return {
    email: user?.email,
    firstname: user?.firstname,
    lastname: user?.lastname,
    azureTenantId: user?.azureTenantId,
    azureClientId: user?.azureClientId,
    azureClientSecret: user?.azureClientSecret,
    azureSubscriptionId: user?.azureSubscriptionId,
    roleName: user?.roleData.right,
  }
}
