import { z } from 'zod'

const bodySchema = z.object({
  refreshToken: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw validationError('Refresh token is required')
  }

  const payload = await decodeToken(parsed.data.refreshToken)
  if (!payload || payload.type !== 'refresh') {
    throw unauthorized('Invalid or expired refresh token')
  }

  const userId = payload.sub as string
  if (!userId) {
    throw unauthorized('Invalid refresh token payload')
  }

  const prisma = usePrisma()
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw unauthorized('User not found')
  }
  if (user.status !== 'active') {
    throw unauthorized('User account is inactive')
  }

  const [accessToken, refreshToken] = await Promise.all([
    createAccessToken({ sub: user.id }),
    createRefreshToken({ sub: user.id }),
  ])

  return apiSuccess({
    accessToken,
    refreshToken,
    tokenType: 'bearer',
    user: formatUser(user),
  }, 'Token refreshed')
})
