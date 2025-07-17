import { login } from '@/api/login/login'
import { useAuth } from '@/context/use-auth'
import type { TLogin } from '@/lib/schema/login.schema'
import { useMutation } from '@tanstack/react-query'

export const useLoginMutation = () => {
  const { signIn } = useAuth()
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (payload: TLogin) => await login(payload),
    onSuccess: async (data) => {
      const isToken = data.data.access_token
      signIn(isToken as string)
    },
  })
}
