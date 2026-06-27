export default defineEventHandler(async (event) => {
  await requireUser(event)
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw validationError('Tag slug is required')

  const prisma = usePrisma()
  const tag = await prisma.tag.findUnique({ where: { slug } })
  if (!tag) throw notFound('Tag not found')

  await prisma.tag.delete({ where: { slug } })
  return apiSuccess(null, 'Tag deleted')
})
