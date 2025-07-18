import cookiesStorage from './cookie-storage'

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const cookie = await cookiesStorage.getItem('auth')

    if (!cookie) return false

    const parsedCookie = JSON.parse(cookie)
    const token = parsedCookie?.state?.token
    console.log(token)
    return !!token
  } catch (error) {
    console.error('Error checking auth status:', error)
    return false
  }
}
export const dateFormat = (date: string): string =>
  new Date(date).toLocaleDateString('id', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
