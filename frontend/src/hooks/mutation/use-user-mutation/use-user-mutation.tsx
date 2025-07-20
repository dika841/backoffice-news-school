import { createUser, deleteUser, updateUser } from '@/api/users/api'
import type { TUserRequestUpdate, TUsersRequest } from '@/api/users/type'
import { useMutation } from '@tanstack/react-query'

export const useCreateUserMutation = () => {
  return useMutation({
    mutationKey: ['create-user'],
    mutationFn: async (payload: TUsersRequest) => await createUser(payload),
  })
}

export const useUpdateUserMutation = (id: string) => {
  return useMutation({
    mutationKey: ['update-user', id],
    mutationFn: async (payload: TUserRequestUpdate) =>
      await updateUser(id, payload),
  })
}

export const useDeleteUserMutation = () => {
  return useMutation({
    mutationKey: ['delete-user'],
    mutationFn: async (id: string) => await deleteUser(id),
  })
}
