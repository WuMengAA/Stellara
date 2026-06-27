export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const docId = getRouterParam(event, 'docId')
  const prisma = usePrisma()

  const series = await prisma.series.findUnique({ where: { slug } })
  if (!series) throw createError({ statusCode: 404, message: 'Series not found' })

  const doc = await prisma.doc.findFirst({
    where: { id: docId, seriesId: series.id },
  })
  if (!doc) throw createError({ statusCode: 404, message: 'Doc not found' })
  return { data: doc }
})
