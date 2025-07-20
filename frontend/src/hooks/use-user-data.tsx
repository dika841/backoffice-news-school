export function decodeToken<T = any>(token: string): T | null {
  try {
    const base64Payload = token.split('.')[1]
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(payload)
  } catch (error) {
    console.error('Invalid JWT token:', error)
    return null
  }
}
