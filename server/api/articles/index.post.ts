import { z } from 'zod'

const bodySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional().default(''),
  coverImage: z.string().optional().default(''),
  categorySlug: z.string().optional().default('uncategorized'),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  writtenAt: z.string().optional(),
  readingTime: z.number().int().optional(),
  pinned: z.boolean().optional().default(false),
  allowComments: z.boolean().optional().default(true),
  seoDescription: z.string().optional().default(''),
  tagSlugs: z.array(z.string()).optional().default([]),
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)

  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw validationError(parsed.error.errors[0]?.message || 'Validation Error')
  }

  const prisma = usePrisma()

  let slug = slugify(parsed.data.title) || 'article'
  let counter = 1
  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${slugify(parsed.data.title) || 'article'}-${counter}`
    counter++
  }

  const article = await prisma.article.create({
    data: {
      title: parsed.data.title,
      slug,
      content: parsed.data.content,
      excerpt: parsed.data.excerpt || null,
      coverImage: parsed.data.coverImage || null,
      categorySlug: parsed.data.categorySlug,
      status: parsed.data.status,
      authorId: user.id,
      writtenAt: parsed.data.writtenAt ? new Date(parsed.data.writtenAt) : null,
      readingTime: parsed.data.readingTime ?? null,
      pinned: parsed.data.pinned,
      allowComments: parsed.data.allowComments,
      seoDescription: parsed.data.seoDescription || null,
      tags: {
        create: parsed.data.tagSlugs.map((tagSlug: string) => ({ tagSlug })),
      },
    },
    include: {
      author: { select: { id: true, name: true, avatar: true, role: true } },
      tags: { include: { tag: { select: { slug: true, name: true } } } },
    },
  })

  setResponseStatus(event, 201)
  return apiSuccess(formatArticle(article), 'Article created')
})
