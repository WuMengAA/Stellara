import { z } from 'zod'

const bodySchema = z.object({
  hidden: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw validationError('Comment ID is required')

  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) throw validationError(parsed.error.errors[0]?.message || 'Validation Error')

  const prisma = usePrisma()
  const comment = await prisma.comment.findUnique({ where: { id } })
  if (!comment) throw notFound('Comment not found')
  if (comment.userId !== user.id && user.role !== 'admin') {
    throw forbidden('Cannot modify this comment')
  }

  const updated = await prisma.comment.update({
    where: { id },
    data: {
      ...(parsed.data.hidden !== undefined && { hidden: parsed.data.hidden }),
    },
  })

  return apiSuccess({
    id: updated.id,
    articleId: updated.articleId,
    userId: updated.userId,
    authorName: updated.authorName,
    content: updated.content,
    hidden: updated.hidden,
    createdAt: updated.createdAt,
  }, 'Comment updated')
})
