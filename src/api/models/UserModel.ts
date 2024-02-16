import BaseModel from "./BaseModel"
import RoleModel from "./RoleModel"
import { hashPassword } from "@/utils/hashPassword"

class UserModel extends BaseModel {
  static tableName: string = "user"

  id!: number
  email!: string
  firstname!: string
  lastname!: string
  passwordSalt!: string
  passwordHash!: string
  azureTenantId!: string
  azureClientId!: string
  azureClientSecret!: string
  azureSubscriptionId!: string
  roleData!: RoleModel

  static relationMappings() {
    return {
      roleData: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: RoleModel,
        filter: (query: any) => query.select("right"),
        join: {
          from: "user.roleId",
          to: "role.id",
        },
      },
    }
  }

  checkPassword = async (password: string): Promise<boolean> => {
    const [passwordHash]: string[] = await hashPassword(
      password,
      this.passwordSalt,
    )

    return passwordHash === this.passwordHash
  }
}

export default UserModel
