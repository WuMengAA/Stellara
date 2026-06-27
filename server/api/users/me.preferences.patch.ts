export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)

  if (typeof body !== 'object' || body === null) {
    throw validationError('Invalid preferences data')
  }

  const prisma = usePrisma()
  const preferences = JSON.stringify(body)

  await prisma.user.update({
    where: { id: user.id },
    data: { preferences },
  })

  return apiSuccess({ preferences: body }, 'Preferences synced')
})
