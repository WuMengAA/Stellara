export default defineEventHandler(async (event) => {
  const user = await requireUser(event)

  const prisma = usePrisma()

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }),
    prisma.notification.count({
      where: { userId: user.id, read: false },
    }),
  ])

  return apiSuccess({ notifications, unreadCount }, 'OK')
})
