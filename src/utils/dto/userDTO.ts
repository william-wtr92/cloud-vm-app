export interface User {
  email: string
  firstname: string
  lastname: string
  passwordHash: string
  passwordSalt: string
  roleId: number
}
