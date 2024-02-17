export const pwdVmGenerator = (): string => {
  const length: number = 12
  const charset: string =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}:"<>?'

  let password: string = ""
  for (let i: number = 0, n: number = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n))
  }

  return password
}
