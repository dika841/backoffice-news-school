import { getUserById, getUsers } from '@/api/users/api'
import { useQuery } from '@tanstack/react-query'

export const useUserQuery = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => await getUsers(),
  })
}

export const useUserQueryById = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => await getUserById(id),
  })
}
