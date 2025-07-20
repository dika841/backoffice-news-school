export type TUserResponse = {
  data: TUser[]
}
export type TUserResponseOne = {
  data: TUser
}
export type TUser = {
  id: string
  username: string
  email: string
  role: string
}

export type TUsersRequest = {
  username: string
  email: string
  password: string
  role?: string
}
export type TUserRequestUpdate = {
  username?: string
  email?: string
  password?: string
  role?: string
}
