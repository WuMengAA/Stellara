import { z } from 'zod'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw validationError('Invalid email or password')
  }

  const { email, password } = parsed.data
  const prisma = usePrisma()

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.password || !verifyPassword(password, user.password)) {
    throw unauthorized('Invalid email or password')
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
  }, 'Login successful')
})
