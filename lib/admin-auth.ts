import { cookies } from 'next/headers'

export const ADMIN_SESSION_COOKIE = 'pritam-admin-session'

export const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'pritampadhan3107@gmail.com'
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'YourAdmin@123'

export function validateAdminCredentials(email: string, password: string) {
  return (
    email.trim().toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase() &&
    password === DEFAULT_ADMIN_PASSWORD
  )
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value === 'authenticated'
}

export async function requireAdmin() {
  const isLoggedIn = await getAdminSession()
  if (!isLoggedIn) {
    throw new Error('Unauthorized')
  }
}
