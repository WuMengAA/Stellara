export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const perPage = Math.min(100, Math.max(1, Number(query.perPage) || 20))
  const status = (query.status as string) || 'published'
  const category = query.category as string | undefined
  const tag = query.tag as string | undefined
  const q = query.q as string | undefined
  const sort = query.sort as string | undefined
  const pinned = query.pinned === 'true' ? true : undefined

  const prisma = usePrisma()

  const where: Record<string, unknown> = {}
  if (pinned) {
    where.pinned = true
  } else {
    where.status = status
  }
  if (category) where.categorySlug = category
  if (tag) where.tags = { some: { tagSlug: tag } }
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { content: { contains: q } },
    ]
  }

  const orderBy: Record<string, string>[] = sort
    ? [{ [sort.startsWith('-') ? sort.slice(1) : sort]: sort.startsWith('-') ? 'desc' : 'asc' }]
    : [{ createdAt: 'desc' }]

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        author: { select: { id: true, name: true, avatar: true, role: true } },
        tags: { include: { tag: { select: { slug: true, name: true } } } },
      },
    }),
    prisma.article.count({ where }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / perPage))

  return apiSuccess(
    { articles: articles.map(formatArticle) },
    'OK',
    {
      page,
      perPage,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }
  )
})
