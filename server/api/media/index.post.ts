export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const prisma = usePrisma()

  const body = await readBody(event)
  if (!body?.url) throw validationError('url is required')

  const media = await prisma.media.create({
    data: {
      filename: body.url.split('/').pop() || 'file',
      originalName: body.originalName || body.url.split('/').pop() || 'file',
      mimeType: body.mimeType || null,
      size: body.size || null,
      type: body.type || 'image',
      url: body.url,
      uploaderId: user.id,
      isPublic: true,
    },
  })

  return apiSuccess(media, 'Uploaded')
})
