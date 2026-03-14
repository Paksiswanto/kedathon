import { SignJWT, jwtVerify, JWTPayload } from 'jose'
import { cookies } from 'next/headers'

export const COOKIE_NAME = 'kp_admin_token'
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')

export interface AdminPayload extends JWTPayload {
  id: string
  username: string
  name: string
}

export async function signToken(payload: AdminPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as AdminPayload
  } catch {
    return null
  }
}

export async function getAdminFromCookies(): Promise<AdminPayload | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}