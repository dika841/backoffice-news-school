import type { TResponse } from '@/common'

export type TLoginResponse = TResponse<{
  access_token: string
  refresh_token?: string
}>
