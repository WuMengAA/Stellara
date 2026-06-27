export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const series = await prisma.series.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { docs: true } } },
  })
  return { data: series }
})
