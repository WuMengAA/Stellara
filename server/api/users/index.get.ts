export default defineEventHandler(async (event) => {
  await requireUser(event)
  const prisma = usePrisma()
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return apiSuccess({ users: users.map(formatUser) })
})
