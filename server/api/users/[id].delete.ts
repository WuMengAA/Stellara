export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw validationError('User ID is required')

  if (id !== user.id) {
    throw forbidden('You can only delete your own account')
  }

  const prisma = usePrisma()
  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) throw notFound('User not found')

  await prisma.user.delete({ where: { id } })
  return apiSuccess(null, 'Account deleted')
})
