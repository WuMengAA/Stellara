import { z } from 'zod'

const bodySchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  categorySlug: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  writtenAt: z.string().optional(),
  readingTime: z.number().int().optional(),
  pinned: z.boolean().optional(),
  allowComments: z.boolean().optional(),
  seoDescription: z.string().optional(),
  tagSlugs: z.array(z.string()).optional(),
})

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw validationError('Article ID is required')

  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw validationError(parsed.error.errors[0]?.message || 'Validation Error')
  }

  const prisma = usePrisma()

  const existing = await prisma.article.findUnique({ where: { id } })
  if (!existing) throw notFound('Article not found')

  const updateData: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(parsed.data)) {
    if (value !== undefined) {
      if (key === 'writtenAt') {
        updateData.writtenAt = value ? new Date(value as string) : null
      } else if (key !== 'tagSlugs') {
        updateData[key] = value
      }
    }
  }

  const article = await prisma.$transaction(async (tx) => {
    if (parsed.data.tagSlugs !== undefined) {
      await tx.articleTag.deleteMany({ where: { articleId: id } })
      if (parsed.data.tagSlugs!.length > 0) {
        await tx.articleTag.createMany({
          data: parsed.data.tagSlugs!.map((tagSlug: string) => ({ articleId: id, tagSlug })),
        })
      }
    }

    return tx.article.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, name: true, avatar: true, role: true } },
        tags: { include: { tag: { select: { slug: true, name: true } } } },
      },
    })
  })

  return apiSuccess(formatArticle(article), 'Article updated')
})
