import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '@/api/categories/api'
import type {
  TCategoryRequest,
  TCategoryRequestUpdate,
} from '@/api/categories/type'
import { useMutation } from '@tanstack/react-query'

export const useCreateCategoryMutation = () => {
  return useMutation({
    mutationKey: ['create-category'],
    mutationFn: async (payload: TCategoryRequest) =>
      await createCategory(payload),
  })
}

export const useUpdateCategoryMutation = (id: string) => {
  return useMutation({
    mutationKey: ['update-category', id],
    mutationFn: async (payload: TCategoryRequestUpdate) =>
      await updateCategory(id, payload),
  })
}

export const useDeleteCategoryMutation = () => {
  return useMutation({
    mutationKey: ['delete-category'],
    mutationFn: async (id: string) => deleteCategory(id),
  })
}
