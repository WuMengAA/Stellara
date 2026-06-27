export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const slug = getRouterParam(event, 'slug')
  const prisma = usePrisma()

  const series = await prisma.series.findUnique({ where: { slug } })
  if (!series) throw createError({ statusCode: 404, message: 'Series not found' })
  if (series.authorId !== user.id && user.role !== 'admin') throw createError({ statusCode: 403, message: 'Not authorized' })

  await prisma.series.delete({ where: { slug } })
  return { ok: true }
})
