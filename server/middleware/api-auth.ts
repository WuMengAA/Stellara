export default defineEventHandler(async (event) => {
  const apiKey = getHeader(event, 'x-api-key')
  if (!apiKey) return

  const prisma = usePrisma()
  const user = await prisma.user.findUnique({ where: { apiKey } })
  if (!user) throw unauthorized('Invalid API key')

  event.context.auth = { type: 'api_key', user }
})
