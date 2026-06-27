import { SignJWT, jwtVerify } from 'jose'
import bcryptjs from 'bcryptjs'

const secret = new TextEncoder().encode(
  process.env.NUXT_JWT_SECRET || 'stellara-dev-jwt-secret-change-in-production'
)

export function hashPassword(password: string): string {
  return bcryptjs.hashSync(password, 10)
}

export function verifyPassword(plain: string, hashed: string): boolean {
  return bcryptjs.compareSync(plain, hashed)
}

export async function createAccessToken(data: Record<string, unknown>): Promise<string> {
  return new SignJWT({ ...data, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .setIssuedAt()
    .sign(secret)
}

export async function createRefreshToken(data: Record<string, unknown>): Promise<string> {
  return new SignJWT({ ...data, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(secret)
}

export async function decodeToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as Record<string, unknown>
  } catch {
    return null
  }
}
