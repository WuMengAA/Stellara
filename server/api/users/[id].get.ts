export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw validationError('User ID is required')

  const prisma = usePrisma()
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw notFound('User not found')

  return apiSuccess({ user: formatUser(user) })
})
