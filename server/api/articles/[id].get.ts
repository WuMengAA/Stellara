export default defineEventHandler(async (event) => {
  const idOrSlug = getRouterParam(event, 'id')
  if (!idOrSlug) throw validationError('Article ID or slug is required')

  const prisma = usePrisma()
  const article = await prisma.article.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      author: { select: { id: true, name: true, avatar: true, role: true } },
      tags: { include: { tag: { select: { slug: true, name: true } } } },
    },
  })

  if (!article) {
    throw notFound('Article not found')
  }

  return apiSuccess(formatArticle(article))
})
