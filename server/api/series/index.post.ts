export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const prisma = usePrisma()
  const series = await prisma.series.create({
    data: { title: body.title, slug, description: body.description || '', authorId: user.id },
  })
  return { data: series }
})
