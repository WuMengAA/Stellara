export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const prisma = usePrisma()
  const series = await prisma.series.findUnique({ where: { slug } })
  if (!series) throw createError({ statusCode: 404, message: 'Series not found' })

  const docs = await prisma.doc.findMany({
    where: { seriesId: series.id },
    orderBy: { order: 'asc' },
  })
  return { data: docs }
})
