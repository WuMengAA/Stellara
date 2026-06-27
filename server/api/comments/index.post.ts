import { z } from 'zod'

const bodySchema = z.object({
  articleId: z.string().min(1),
  content: z.string().min(1),
  authorName: z.string().optional(),
  authorEmail: z.string().optional(),
  parentId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw validationError(parsed.error.errors[0]?.message || 'Validation Error')
  }

  const prisma = usePrisma()

  if (parsed.data.parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: parsed.data.parentId } })
    if (!parent) throw notFound('Parent comment not found')
  }

  const article = await prisma.article.findUnique({ where: { id: parsed.data.articleId } })
  if (!article) throw notFound('Article not found')

  const commenterName = parsed.data.authorName ?? user?.name ?? 'Anonymous'

  const comment = await prisma.comment.create({
    data: {
      articleId: parsed.data.articleId,
      userId: user?.id ?? null,
      authorName: commenterName,
      authorEmail: parsed.data.authorEmail ?? null,
      content: parsed.data.content,
      parentId: parsed.data.parentId ?? null,
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      parent: { select: { id: true, authorName: true, content: true } },
    },
  })

  // Notify article author if they're not the commenter
  if (article.authorId !== user?.id) {
    await prisma.notification.create({
      data: {
        userId: article.authorId,
        type: 'new_comment',
        title: `${commenterName} 评论了你的文章 "${article.title}"`,
        link: `/blog/${article.slug}`,
      },
    })
  }

  setResponseStatus(event, 201)
  return apiSuccess({
    id: comment.id,
    articleId: comment.articleId,
    userId: comment.userId,
    authorName: comment.authorName,
    authorEmail: comment.authorEmail,
    content: comment.content,
    parentId: comment.parentId,
    likes: comment.likes,
    hidden: comment.hidden,
    createdAt: comment.createdAt,
    user: comment.user,
    parent: comment.parent,
  }, 'Comment created')
})
