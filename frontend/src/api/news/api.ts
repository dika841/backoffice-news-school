import { Api } from '@/lib/axios/axios'
import type {
  TNewsParams,
  TNewsRequest,
  TNewsRequestUpdate,
  TNewsResponse,
  TNewsResponseOne,
} from './type'
import type { TResponse } from '@/common'

export const getNews = async (
  params: TNewsParams,
): Promise<TResponse<TNewsResponse>> => {
  const response = await Api.get<TResponse<TNewsResponse>>('/news', { params })
  return response.data
}

export const getNewsById = async (id: string): Promise<TNewsResponseOne> => {
  const response = await Api.get<TNewsResponseOne>(`/news/${id}`)
  return response.data
}

export const createNews = async (payload: TNewsRequest) => {
  const response = await Api.post('/news', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const updateNews = async (id: string, payload: TNewsRequestUpdate) => {
  const response = await Api.put(`/news/${id}`, payload)
  return response.data
}

export const deleteNews = async (id: string) => {
  const response = await Api.delete(`/news/${id}`)
  return response.data
}
