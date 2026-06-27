export default defineEventHandler(async (event) => {
  await requireUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw validationError('Article ID is required')

  const prisma = usePrisma()
  const existing = await prisma.article.findUnique({ where: { id } })
  if (!existing) throw notFound('Article not found')

  await prisma.article.delete({ where: { id } })
  return apiSuccess(null, 'Article deleted')
})
