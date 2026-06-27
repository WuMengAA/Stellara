import { z } from 'zod'

const bodySchema = z.object({
  name: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  tagline: z.string().optional(),
  nameStyle: z.any().optional(),
  bioStyle: z.any().optional(),
  profileLayout: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw validationError('User ID is required')

  if (id !== user.id && user.role !== 'admin') {
    throw forbidden('You can only update your own profile')
  }

  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw validationError(parsed.error.errors[0]?.message || 'Validation Error')
  }

  if ((parsed.data.role || parsed.data.status) && user.role !== 'admin') {
    throw forbidden('Only admins can change role or status')
  }

  const prisma = usePrisma()

  const updateData: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(parsed.data)) {
    if (value !== undefined) {
      if ((key === 'nameStyle' || key === 'bioStyle') && typeof value === 'object') {
        updateData[key] = JSON.stringify(value)
      } else {
        updateData[key] = value
      }
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
  })

  return apiSuccess({ user: formatUser(updated) }, 'Profile updated')
})
