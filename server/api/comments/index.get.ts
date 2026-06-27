export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const articleId = query.articleId as string
  const prisma = usePrisma()

  if (articleId) {
    const comments = await prisma.comment.findMany({
      where: { articleId, hidden: false },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        parent: { select: { id: true, authorName: true, content: true } },
      },
    })

    return apiSuccess({
      comments: comments.map((c) => ({
        id: c.id,
        articleId: c.articleId,
        userId: c.userId,
        authorName: c.authorName,
        authorEmail: c.authorEmail,
        content: c.content,
        parentId: c.parentId,
        likes: c.likes,
        hidden: c.hidden,
        createdAt: c.createdAt,
        user: c.user,
        parent: c.parent,
      })),
    })
  }

  await requireUser(event)

  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      article: { select: { id: true, title: true, slug: true } },
    },
  })

  return apiSuccess({
    comments: comments.map((c) => ({
      id: c.id,
      articleId: c.articleId,
      article: c.article,
      userId: c.userId,
      authorName: c.authorName,
      authorEmail: c.authorEmail,
      content: c.content,
      parentId: c.parentId,
      likes: c.likes,
      hidden: c.hidden,
      createdAt: c.createdAt,
      user: c.user,
    })),
  })
})
