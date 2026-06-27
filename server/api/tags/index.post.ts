import { z } from 'zod'

const bodySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional(),
  orderIdx: z.number().int().optional().default(0),
})

export default defineEventHandler(async (event) => {
  await requireUser(event)
  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw validationError(parsed.error.errors[0]?.message || 'Validation Error')
  }

  const prisma = usePrisma()

  const existing = await prisma.tag.findUnique({ where: { slug: parsed.data.slug } })
  if (existing) throw conflict('Tag slug already exists')

  const tag = await prisma.tag.create({
    data: {
      slug: parsed.data.slug,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      color: parsed.data.color ?? null,
      orderIdx: parsed.data.orderIdx,
    },
  })

  setResponseStatus(event, 201)
  return apiSuccess({
    id: tag.slug,
    slug: tag.slug,
    name: tag.name,
    description: tag.description,
    color: tag.color,
    status: tag.status,
    usageCount: tag.usageCount,
    orderIdx: tag.orderIdx,
    createdAt: tag.createdAt,
  }, 'Tag created')
})
