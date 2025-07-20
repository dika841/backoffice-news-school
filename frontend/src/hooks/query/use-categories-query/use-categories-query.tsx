import { getCategories, getCategoryById } from '@/api/categories/api'
import { useQuery } from '@tanstack/react-query'

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: async () => await getCategories(),
    staleTime: 5000,
    refetchOnWindowFocus: false,
  })

export const useCategoriesQueryById = (id: string) =>
  useQuery({
    queryKey: ['categories-by-id', id],
    queryFn: async () => await getCategoryById(id),
  })
