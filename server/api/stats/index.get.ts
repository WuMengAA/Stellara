export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  if (user.role !== 'admin') throw forbidden('Admin access required')

  const prisma = usePrisma()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [
    totalArticles,
    totalViewsAgg,
    totalComments,
    totalUsers,
    totalTags,
    recentArticles,
    topArticles,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.aggregate({ _sum: { viewCount: true } }),
    prisma.comment.count(),
    prisma.user.count(),
    prisma.tag.count(),
    prisma.article.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, viewCount: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.article.findMany({
      where: { status: 'published' },
      orderBy: { viewCount: 'desc' },
      take: 10,
      select: { title: true, slug: true, viewCount: true },
    }),
  ])

  const viewsByDayMap = new Map<string, number>()
  for (const article of recentArticles) {
    const dateKey = article.createdAt.toISOString().slice(0, 10)
    viewsByDayMap.set(dateKey, (viewsByDayMap.get(dateKey) || 0) + article.viewCount)
  }
  const viewsByDay = Array.from(viewsByDayMap.entries()).map(([date, count]) => ({ date, count }))

  return apiSuccess({
    totalArticles,
    totalViews: totalViewsAgg._sum.viewCount || 0,
    totalComments,
    totalUsers,
    totalTags,
    viewsByDay,
    topArticles,
  })
})
