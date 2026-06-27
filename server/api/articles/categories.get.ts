export default defineEventHandler(async () => {
  const prisma = usePrisma()

  const grouped = await prisma.article.groupBy({
    by: ['categorySlug'],
    _count: { id: true },
    where: { status: 'published' },
    orderBy: { _count: { id: 'desc' } },
  })

  const categories = grouped.map((g) => ({
    slug: g.categorySlug,
    name: g.categorySlug === 'uncategorized' ? '未分类'
      : g.categorySlug.charAt(0).toUpperCase() + g.categorySlug.slice(1),
    count: g._count.id,
  }))

  return apiSuccess(categories)
})
