import { createNews, deleteNews, updateNews } from '@/api/news/api'
import type { TNewsRequest, TNewsRequestUpdate } from '@/api/news/type'
import { useMutation } from '@tanstack/react-query'

export const useNewsMutation = () =>
  useMutation({
    mutationKey: ['create-news'],
    mutationFn: async (payload: TNewsRequest) => createNews(payload),
  })

export const useDeleteNewsMutation = () =>
  useMutation({
    mutationKey: ['delete-news'],
    mutationFn: async (id: string) => deleteNews(id),
  })

export const useUpdateNewsMutation = (id: string) =>
  useMutation({
    mutationKey: ['update-news', id],
    mutationFn: async (payload: TNewsRequestUpdate) => updateNews(id, payload),
  })
