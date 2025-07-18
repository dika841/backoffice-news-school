import { useQuery } from '@tanstack/react-query'
import type { TNewsParams, TNewsResponse } from '@/api/news/type'
import type { TResponse } from '@/common'
import { getNews } from '@/api/news/api'

export const useGetNewsQuery = (params: TNewsParams) => {
  return useQuery<TResponse<TNewsResponse>, Error>({
    queryKey: ['news', params],
    queryFn: () => getNews(params),
    staleTime: 5000,
    placeholderData: (previousData) => previousData,
  })
}
