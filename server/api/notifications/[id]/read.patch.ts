export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw validationError('Notification ID is required')

  const prisma = usePrisma()

  const notification = await prisma.notification.findUnique({ where: { id } })
  if (!notification) throw notFound('Notification not found')
  if (notification.userId !== user.id) throw forbidden('Not your notification')

  await prisma.notification.update({
    where: { id },
    data: { read: true },
  })

  return apiSuccess(null, 'Notification marked as read')
})
