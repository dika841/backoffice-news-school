import { Api } from '@/lib/axios/axios'
import type { TLogin } from '@/lib/schema/login.schema'
import type { TLoginResponse } from './type'

export const login = async (payload: TLogin): Promise<TLoginResponse> => {
  const res = await Api.post('/login', payload)
  return res.data
}
