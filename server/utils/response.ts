export function apiSuccess<T>(data?: T, message = 'OK', meta?: Record<string, unknown>) {
  return {
    code: 200,
    message,
    data: data ?? null,
    meta: meta ?? null,
    timestamp: new Date().toISOString(),
  }
}

export function apiError(code: number, message: string, errors?: { field?: string; message: string }[]) {
  return {
    code,
    message,
    data: null,
    errors: errors ?? null,
    timestamp: new Date().toISOString(),
  }
}

export function formatUser(user: {
  id: string
  email: string
  name: string
  avatar: string | null
  role: string
  status: string
  bio: string
  tagline: string
  verificationStatus: string
  verificationRequested: Date | null
  verificationApproved: Date | null
  nameStyle: string | null
  bioStyle: string | null
  profileLayout: string | null
  preferences: string | null
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    role: user.role,
    status: user.status,
    bio: user.bio,
    tagline: user.tagline,
    verificationStatus: user.verificationStatus,
    verificationRequestedAt: user.verificationRequested,
    verificationApprovedAt: user.verificationApproved,
    nameStyle: user.nameStyle,
    bioStyle: user.bioStyle,
    profileLayout: user.profileLayout,
    preferences: user.preferences,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export function formatArticle(article: {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  authorId: string
  categorySlug: string
  status: string
  viewCount: number
  writtenAt: Date | null
  readingTime: number | null
  pinned: boolean
  allowComments: boolean
  seoDescription: string | null
  createdAt: Date
  updatedAt: Date
  author?: {
    id: string
    name: string
    avatar: string | null
    role: string
  } | null
  tags?: { tag: { slug: string; name: string } }[]
}) {
  const data: Record<string, unknown> = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    content: article.content,
    excerpt: article.excerpt,
    coverImage: article.coverImage,
    authorId: article.authorId,
    categorySlug: article.categorySlug,
    status: article.status,
    viewCount: article.viewCount,
    writtenAt: article.writtenAt,
    readingTime: article.readingTime,
    pinned: article.pinned,
    allowComments: article.allowComments,
    seoDescription: article.seoDescription,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  }
  if (article.author) {
    data.author = article.author
  }
  if (article.tags) {
    data.tags = article.tags.map((at: { tag: { slug: string; name: string } }) => at.tag)
  }
  return data
}
