export async function getUserFromEvent(event: any) {
  if (event.context.auth?.type === 'api_key') {
    return event.context.auth.user
  }

  const authorization = getHeader(event, 'Authorization')
  if (!authorization?.startsWith('Bearer ')) return null

  const token = authorization.slice(7)
  const payload = await decodeToken(token)
  if (!payload) return null

  const userId = payload.sub as string
  if (!userId) return null

  const prisma = usePrisma()
  const user = await prisma.user.findUnique({ where: { id: userId } })
  return user
}

export async function requireUser(event: any) {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw unauthorized('Authentication required')
  }
  return user
}

/**
 * Check if the authenticated user has a specific API scope
 */
export async function requireScope(event: any, scope: string) {
  const user = await requireUser(event)

  if (user.apiScopes?.split(',').map(s => s.trim()).includes(scope)) {
    return user
  }

  throw forbidden(`Missing required scope: ${scope}`)
}
