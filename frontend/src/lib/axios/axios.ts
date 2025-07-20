import axios from 'axios'
import { ApiUrl } from '@/constants'
import { useAuth } from '@/context/use-auth'

export const Api = axios.create({
  baseURL: ApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

Api.interceptors.request.use((config) => {
  const token = useAuth.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue: {
  resolve: (token?: string) => void
  reject: (error: any) => void
}[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token!)
  })
  failedQueue = []
}
Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return Api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true
      const { refreshToken, signIn, signOut } = useAuth.getState()

      try {
        const res = await axios.post(
          `${ApiUrl}/refresh-token`,
          {
            refresh_token: refreshToken,
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        const newToken = res?.data?.data?.access_token
        if (!newToken)
          throw new Error('Access token not found in refresh response')

        signIn(newToken, refreshToken as string)
        processQueue(null, newToken)

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return Api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        signOut()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)
