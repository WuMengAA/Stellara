export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const slug = getRouterParam(event, 'slug')
  const docId = getRouterParam(event, 'docId')
  const body = await readBody(event)
  const prisma = usePrisma()

  const series = await prisma.series.findUnique({ where: { slug } })
  if (!series) throw createError({ statusCode: 404, message: 'Series not found' })

  const doc = await prisma.doc.findFirst({ where: { id: docId, seriesId: series.id } })
  if (!doc) throw createError({ statusCode: 404, message: 'Doc not found' })

  const updated = await prisma.doc.update({
    where: { id: docId },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.parentId !== undefined && { parentId: body.parentId || null }),
      ...(body.order !== undefined && { order: body.order }),
    },
  })
  return { data: updated }
})
