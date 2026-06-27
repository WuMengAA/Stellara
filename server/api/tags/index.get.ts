export default defineEventHandler(async () => {
  const prisma = usePrisma()
  const tags = await prisma.tag.findMany({
    orderBy: [{ orderIdx: 'asc' }, { name: 'asc' }],
  })

  return apiSuccess(
    tags.map((t) => ({
      id: t.slug,
      slug: t.slug,
      name: t.name,
      description: t.description,
      color: t.color,
      status: t.status,
      usageCount: t.usageCount,
      orderIdx: t.orderIdx,
      createdAt: t.createdAt,
    }))
  )
})
