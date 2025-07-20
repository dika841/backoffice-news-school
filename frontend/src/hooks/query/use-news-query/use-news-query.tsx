import { useQuery } from '@tanstack/react-query'
import type {
  TNewsParams,
  TNewsResponse,
  TNewsResponseOne,
} from '@/api/news/type'
import type { TResponse } from '@/common'
import { getNews, getNewsById } from '@/api/news/api'

export const useGetNewsQuery = (params: TNewsParams) => {
  return useQuery<TResponse<TNewsResponse>, Error>({
    queryKey: ['news', params],
    queryFn: async () => await getNews(params),
    staleTime: 5000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  })
}

export const useGetNewsByIdQuery = (id: string) => {
  return useQuery<TNewsResponseOne, Error>({
    queryKey: ['news', id],
    queryFn: async () => await getNewsById(id),
  })
}
