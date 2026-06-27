import { z } from 'zod'

const bodySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(''),
  icon: z.string().optional().default('Sparkles'),
  duration: z.number().int().optional().default(3),
  steps: z.string().optional().default('[]'),
})

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw validationError(parsed.error.errors[0]?.message || 'Validation Error')
  }

  const prisma = usePrisma()
  const tutorial = await prisma.tutorial.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      icon: parsed.data.icon,
      duration: parsed.data.duration,
      steps: parsed.data.steps,
      createdBy: user.id,
    },
  })

  setResponseStatus(event, 201)
  return apiSuccess({
    id: tutorial.id,
    title: tutorial.title,
    description: tutorial.description,
    icon: tutorial.icon,
    duration: tutorial.duration,
    steps: JSON.parse(tutorial.steps),
    builtin: tutorial.builtin,
    createdBy: tutorial.createdBy,
    createdAt: tutorial.createdAt,
    updatedAt: tutorial.updatedAt,
  }, 'Tutorial created')
})
