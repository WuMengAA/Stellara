export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw validationError('Article ID is required')

  const prisma = usePrisma()
  const existing = await prisma.article.findUnique({ where: { id } })
  if (!existing) throw notFound('Article not found')

  const article = await prisma.article.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  })

  return apiSuccess({ viewCount: article.viewCount })
})
