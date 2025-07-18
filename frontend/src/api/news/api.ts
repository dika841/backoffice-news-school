import { Api } from '@/lib/axios/axios'
import type { TNewsParams, TNewsResponse } from './type'
import type { TResponse } from '@/common'

export const getNews = async (
  params: TNewsParams,
): Promise<TResponse<TNewsResponse>> => {
  const response = await Api.get<TResponse<TNewsResponse>>('/news', { params })
  return response.data
}
