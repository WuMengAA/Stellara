const TEMPLATES: Record<string, string> = {
  blank: '',
  'api-ref': '## 概述\n\n## 请求\n\n## 响应\n\n## 错误码\n\n## 示例',
  guide: '## 前置要求\n\n## 步骤\n\n## 说明',
  note: '## 背景\n\n## 正文',
}

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const slug = getRouterParam(event, 'slug')
  const body = await readBody(event)
  const prisma = usePrisma()

  if (!body.title?.trim()) throw createError({ statusCode: 400, message: 'Title is required' })
  if (!['doc', 'folder'].includes(body.type || 'doc')) throw createError({ statusCode: 400, message: 'Type must be doc or folder' })

  const series = await prisma.series.findUnique({ where: { slug } })
  if (!series) throw createError({ statusCode: 404, message: 'Series not found' })

  const docSlug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '') || 'untitled'
  let content = body.type === 'folder' ? '' : (TEMPLATES[body.template || 'blank'] || '')
  let articleId: string | null = body.articleId || null

  if (articleId && body.type !== 'folder') {
    const article = await prisma.article.findUnique({ where: { id: articleId } })
    if (article) {
      content = article.content
      if (!body.title?.trim()) body.title = article.title
    } else {
      articleId = null
    }
  }

  const doc = await prisma.doc.create({
    data: {
      seriesId: series.id,
      parentId: body.parentId || null,
      title: body.title,
      slug: docSlug,
      type: body.type || 'doc',
      content,
      template: body.template || 'blank',
      articleId,
      order: body.order ?? 0,
    },
  })
  return { data: doc }
})
