export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const prisma = usePrisma()
  const series = await prisma.series.findUnique({
    where: { slug },
    include: {
      docs: { orderBy: { order: 'asc' } },
      author: { select: { id: true, name: true, avatar: true } },
    },
  })
  if (!series) throw createError({ statusCode: 404, message: 'Series not found' })
  return { data: series }
})
