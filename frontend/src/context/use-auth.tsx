import cookiesStorage from '@/utils/cookie-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
interface IAuthStore {
  accessToken: string | null
  refreshToken: string | null
  signIn: (access: string, refresh: string) => void
  signOut: () => void
}

export const useAuth = create(
  persist<IAuthStore>(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      signIn: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),
      signOut: () => {
        set({ accessToken: null, refreshToken: null })
        cookiesStorage.removeItem('auth')
      },
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => cookiesStorage),
    },
  ),
)
