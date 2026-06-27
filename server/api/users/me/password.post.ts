import { z } from 'zod'

const bodySchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
})

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw validationError('Invalid password data')
  }

  const { currentPassword, newPassword } = parsed.data

  if (!user.password || !verifyPassword(currentPassword, user.password)) {
    throw validationError('Current password is incorrect')
  }

  const prisma = usePrisma()
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashPassword(newPassword) },
  })

  return apiSuccess(null, 'Password updated')
})
