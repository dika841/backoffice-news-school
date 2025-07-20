import { Api } from '@/lib/axios/axios'
import type { TUser, TUserRequestUpdate, TUsersRequest } from './type'
import type { TResponse } from '@/common'

export const getUsers = async (): Promise<TResponse<TUser[]>> => {
  const res = await Api.get('/users')
  return res.data
}

export const getUserById = async (id: string) => {
  const res = await Api.get(`/users/${id}`)
  return res.data
}

export const createUser = async (payload: TUsersRequest) => {
  const res = await Api.post('/users', payload)
  return res.data
}

export const updateUser = async (id: string, payload: TUserRequestUpdate) => {
  const res = await Api.put(`/users/${id}`, payload)
  return res.data
}

export const deleteUser = async (id: string) => {
  const res = await Api.delete(`/users/${id}`)
  return res.data
}
