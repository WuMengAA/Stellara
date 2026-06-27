import { z } from 'zod'

const bodySchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw validationError(parsed.error.errors[0]?.message || 'Validation Error')
  }

  const { email, name, password } = parsed.data
  const prisma = usePrisma()

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw conflict('Email already registered')
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashPassword(password),
    },
  })

  const [accessToken, refreshToken] = await Promise.all([
    createAccessToken({ sub: user.id }),
    createRefreshToken({ sub: user.id }),
  ])

  setResponseStatus(event, 201)
  return apiSuccess({
    accessToken,
    refreshToken,
    tokenType: 'bearer',
    user: formatUser(user),
  }, 'Registration successful')
})
