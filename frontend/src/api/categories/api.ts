import { Api } from '@/lib/axios/axios'
import type {
  TCategoryRequest,
  TCategoryRequestUpdate,
  TCategoryResponse,
  TCategoryResponseOne,
} from './type'
import type { TResponse } from '@/common'

export const getCategories = async (): Promise<
  TResponse<TCategoryResponse[]>
> => {
  const response = await Api.get('/categories')
  return response.data
}

export const getCategoryById = async (
  id: string,
): Promise<TCategoryResponseOne> => {
  const response = await Api.get<TCategoryResponseOne>(`/categories/${id}`)
  return response.data
}

export const deleteCategory = async (id: string) => {
  const response = await Api.delete(`/categories/${id}`)
  return response.data
}

export const createCategory = async (payload: TCategoryRequest) => {
  const response = await Api.post('/categories', payload)
  return response.data
}

export const updateCategory = async (
  id: string,
  payload: TCategoryRequestUpdate,
) => {
  const response = await Api.put(`/categories/${id}`, payload)
  return response.data
}
