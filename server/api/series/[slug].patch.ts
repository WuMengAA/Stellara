export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const slug = getRouterParam(event, 'slug')
  const body = await readBody(event)
  const prisma = usePrisma()

  const series = await prisma.series.findUnique({ where: { slug } })
  if (!series) throw createError({ statusCode: 404, message: 'Series not found' })
  if (series.authorId !== user.id && user.role !== 'admin') throw createError({ statusCode: 403, message: 'Not authorized' })

  const updated = await prisma.series.update({
    where: { slug },
    data: {
      ...(body.title && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.icon && { icon: body.icon }),
    },
  })
  return { data: updated }
})
