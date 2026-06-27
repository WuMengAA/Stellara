export default defineEventHandler(async (event) => {
  const user = await requireUser(event)

  const prisma = usePrisma()

  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  })

  return apiSuccess(null, 'All notifications marked as read')
})
