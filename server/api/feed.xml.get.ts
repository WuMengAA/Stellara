export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const articles = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { author: { select: { name: true } }, tags: { include: { tag: true } } },
  })

  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl || 'https://stellara.local'
  const siteName = config.public.siteName || 'Stellara'

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
    <description>${config.public.siteDescription || ''}</description>
    <language>zh-CN</language>
    <atom:link href="${siteUrl}/api/feed.xml" rel="self" type="application/rss+xml"/>
    ${articles.map(a => `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${siteUrl}/blog/${a.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${a.slug}</guid>
      <description><![CDATA[${(a.excerpt || a.content.slice(0, 300) + '...')}]]></description>
      <pubDate>${new Date(a.createdAt).toUTCString()}</pubDate>
      <author>${a.author?.name || 'Unknown'}</author>
    </item>`).join('\n')}
  </channel>
</rss>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return feed
})
