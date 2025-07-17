import { ApiUrl } from '@/constants'
import { useAuth } from '@/context/use-auth'
import axios from 'axios'
export const Api = axios.create({
  baseURL: ApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

Api.interceptors.request.use((config) => {
  const token = useAuth.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
