export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw validationError('Comment ID is required')

  const prisma = usePrisma()
  const comment = await prisma.comment.findUnique({ where: { id } })
  if (!comment) throw notFound('Comment not found')
  if (comment.userId !== user.id) throw forbidden('Cannot delete this comment')

  await prisma.comment.delete({ where: { id } })
  return apiSuccess(null, 'Comment deleted')
})
