function parseSteps(steps: string): unknown[] {
  if (!steps || steps === '[]') return []
  try {
    return JSON.parse(steps)
  } catch {
    return []
  }
}

export default defineEventHandler(async () => {
  const prisma = usePrisma()
  const tutorials = await prisma.tutorial.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return apiSuccess(
    tutorials.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      icon: t.icon,
      duration: t.duration,
      steps: parseSteps(t.steps),
      builtin: t.builtin,
      createdBy: t.createdBy,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }))
  )
})
