export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const prisma = usePrisma()

  const page = Math.max(1, Number(query.page) || 1)
  const perPage = Math.min(50, Math.max(1, Number(query.perPage) || 20))

  const [data, total] = await Promise.all([
    prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { uploader: { select: { id: true, name: true } } },
    }),
    prisma.media.count(),
  ])

  return apiSuccess({ data, meta: { total, page, perPage } })
})
