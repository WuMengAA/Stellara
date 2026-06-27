# 文档库 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Add a docs library subsystem with series/folder tree organization, templates, and two-step editing.

**Architecture:** Prisma models (Series + Doc with self-referencing tree) → 10 API endpoints → 4 frontend pages + tree component. Reuses existing auth middleware and editor pattern from `pages/editor/new.vue`.

**Tech Stack:** Nuxt 3 (Nitro), Prisma/SQLite, Vue 3, markdown-it

---

## File Structure

```
# New files
prisma/                          # MODIFIED: add Series + Doc models
server/api/series/
  index.get.ts                   # GET /api/series
  index.post.ts                  # POST /api/series
  [slug].get.ts                  # GET /api/series/[slug]
  [slug].patch.ts                # PATCH /api/series/[slug]
  [slug].delete.ts               # DELETE /api/series/[slug]
server/api/series/[slug]/docs/
  index.get.ts                   # GET /api/series/[slug]/docs
  index.post.ts                  # POST /api/series/[slug]/docs
  [docId].get.ts                 # GET /api/series/[slug]/docs/[docId]
  [docId].patch.ts               # PATCH /api/series/[slug]/docs/[docId]
  [docId].delete.ts              # DELETE /api/series/[slug]/docs/[docId]
pages/docs/
  index.vue                      # Series list (card grid)
  [slug].vue                     # Series detail (file tree + content/editor)
  [slug]/new.vue                 # New doc/folder form
  [slug]/edit/[docId].vue        # Edit doc content
components/
  DocTree.vue                    # Recursive file tree sidebar
  DocEditor.vue                  # Full markdown editor
layouts/default.vue              # MODIFIED: add /docs link
composables/
  useSeries.ts                   # Series-related fetch/state helpers
```

---

### Task 1: Prisma — Add Series and Doc models

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add Series model**

Add before the User model's relations or after Notification model:

```prisma
model Series {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String   @default("")
  icon        String   @default("📚")
  coverImage  String?
  authorId    String   @map("author_id")
  isPublic    Boolean  @default(true)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @default(now()) @updatedAt @map("updated_at")

  author User  @relation(fields: [authorId], references: [id])
  docs   Doc[]

  @@map("series")
}
```

- [ ] **Step 2: Add Doc model**

```prisma
model Doc {
  id        String   @id @default(cuid())
  seriesId  String   @map("series_id")
  parentId  String?  @map("parent_id")
  title     String
  slug      String
  type      String   @default("doc")
  content   String   @default("")
  order     Int      @default(0)
  template  String   @default("blank")
  articleId String?  @map("article_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @default(now()) @updatedAt @map("updated_at")

  series   Series @relation(fields: [seriesId], references: [id], onDelete: Cascade)
  parent   Doc?   @relation("DocTree", fields: [parentId], references: [id])
  children Doc[]  @relation("DocTree")

  @@unique([seriesId, slug])
  @@map("docs")
}
```

- [ ] **Step 3: Add relations to User model**

```prisma
model User {
  // ... existing fields
  series      Series[]
  // ... existing relations
}
```

- [ ] **Step 4: Run prisma db push**

```bash
cd e:\Sstellara\stellara-nuxt && npx prisma db push --accept-data-loss
```

Expected: `Your database is now in sync with your Prisma schema.`

---

### Task 2: API — Series CRUD

**Files:**
- Create: `server/api/series/index.get.ts`
- Create: `server/api/series/index.post.ts`
- Create: `server/api/series/[slug].get.ts`
- Create: `server/api/series/[slug].patch.ts`
- Create: `server/api/series/[slug].delete.ts`

- [ ] **Step 1: Create GET /api/series — list all series**

```typescript
export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const series = await prisma.series.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { docs: true } } },
  })
  return { data: series }
})
```

- [ ] **Step 2: Create POST /api/series — create series**

```typescript
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const prisma = usePrisma()
  const series = await prisma.series.create({
    data: { title: body.title, slug, description: body.description || '', authorId: user.id },
  })
  return { data: series }
})
```

- [ ] **Step 3: Create GET /api/series/[slug] — series detail with doc tree**

```typescript
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const prisma = usePrisma()
  const series = await prisma.series.findUnique({
    where: { slug },
    include: {
      docs: { orderBy: { order: 'asc' } },
      author: { select: { id: true, name: true, avatar: true } },
    },
  })
  if (!series) throw createError({ statusCode: 404, message: 'Series not found' })
  return { data: series }
})
```

- [ ] **Step 4: Create PATCH /api/series/[slug] — update series**

```typescript
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const slug = getRouterParam(event, 'slug')
  const body = await readBody(event)
  const prisma = usePrisma()

  const series = await prisma.series.findUnique({ where: { slug } })
  if (!series) throw createError({ statusCode: 404, message: 'Series not found' })
  if (series.authorId !== user.id && user.role !== 'admin') throw forbidden('Not authorized')

  const updated = await prisma.series.update({
    where: { slug },
    data: {
      ...(body.title && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.icon && { icon: body.icon }),
    },
  })
  return { data: updated }
})
```

- [ ] **Step 5: Create DELETE /api/series/[slug] — delete series**

```typescript
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const slug = getRouterParam(event, 'slug')
  const prisma = usePrisma()

  const series = await prisma.series.findUnique({ where: { slug } })
  if (!series) throw createError({ statusCode: 404, message: 'Series not found' })
  if (series.authorId !== user.id && user.role !== 'admin') throw forbidden('Not authorized')

  await prisma.series.delete({ where: { slug } })
  return { ok: true }
})
```

What is `forbidden`? Let me check existing patterns.

Looking at server/utils/middleware.ts — it uses `forbidden()` from h3. Available globally.

---

### Task 3: API — Docs CRUD (nested under series)

**Files:**
- Create: `server/api/series/[slug]/docs/index.get.ts`
- Create: `server/api/series/[slug]/docs/index.post.ts`
- Create: `server/api/series/[slug]/docs/[docId].get.ts`
- Create: `server/api/series/[slug]/docs/[docId].patch.ts`
- Create: `server/api/series/[slug]/docs/[docId].delete.ts`

- [ ] **Step 1: Create GET /api/series/[slug]/docs — list docs in series**

```typescript
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const prisma = usePrisma()
  const series = await prisma.series.findUnique({ where: { slug } })
  if (!series) throw createError({ statusCode: 404, message: 'Series not found' })

  const docs = await prisma.doc.findMany({
    where: { seriesId: series.id },
    orderBy: { order: 'asc' },
  })
  return { data: docs }
})
```

- [ ] **Step 2: Create POST /api/series/[slug]/docs — create doc or folder**

```typescript
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
  const content = body.type === 'folder' ? '' : (TEMPLATES[body.template || 'blank'] || '')

  const doc = await prisma.doc.create({
    data: {
      seriesId: series.id,
      parentId: body.parentId || null,
      title: body.title,
      slug: docSlug,
      type: body.type || 'doc',
      content,
      template: body.template || 'blank',
      order: body.order ?? 0,
    },
  })
  return { data: doc }
})
```

- [ ] **Step 3: Create GET /api/series/[slug]/docs/[docId] — get single doc**

```typescript
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const docId = getRouterParam(event, 'docId')
  const prisma = usePrisma()

  const series = await prisma.series.findUnique({ where: { slug } })
  if (!series) throw createError({ statusCode: 404, message: 'Series not found' })

  const doc = await prisma.doc.findFirst({
    where: { id: docId, seriesId: series.id },
  })
  if (!doc) throw createError({ statusCode: 404, message: 'Doc not found' })
  return { data: doc }
})
```

- [ ] **Step 4: Create PATCH /api/series/[slug]/docs/[docId] — update doc**

```typescript
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const slug = getRouterParam(event, 'slug')
  const docId = getRouterParam(event, 'docId')
  const body = await readBody(event)
  const prisma = usePrisma()

  const series = await prisma.series.findUnique({ where: { slug } })
  if (!series) throw createError({ statusCode: 404, message: 'Series not found' })

  const doc = await prisma.doc.findFirst({ where: { id: docId, seriesId: series.id } })
  if (!doc) throw createError({ statusCode: 404, message: 'Doc not found' })

  const updated = await prisma.doc.update({
    where: { id: docId },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.parentId !== undefined && { parentId: body.parentId || null }),
      ...(body.order !== undefined && { order: body.order }),
    },
  })
  return { data: updated }
})
```

- [ ] **Step 5: Create DELETE /api/series/[slug]/docs/[docId] — delete doc**

```typescript
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const slug = getRouterParam(event, 'slug')
  const docId = getRouterParam(event, 'docId')
  const prisma = usePrisma()

  const series = await prisma.series.findUnique({ where: { slug } })
  if (!series) throw createError({ statusCode: 404, message: 'Series not found' })

  const doc = await prisma.doc.findFirst({ where: { id: docId, seriesId: series.id } })
  if (!doc) throw createError({ statusCode: 404, message: 'Doc not found' })

  await prisma.doc.delete({ where: { id: docId } })
  return { ok: true }
})
```

---

### Task 4: Composables — useSeries helper

**Files:**
- Create: `composables/useSeries.ts`

- [ ] **Step 1: Create useSeries composable**

```typescript
export function useSeries() {
  const seriesList = ref<any[]>([])
  const currentSeries = ref<any>(null)
  const currentDoc = ref<any>(null)
  const loading = ref(false)

  async function fetchSeries() {
    loading.value = true
    try {
      const res = await $fetch('/api/series')
      seriesList.value = (res as any).data || []
    } finally { loading.value = false }
  }

  async function fetchSeriesBySlug(slug: string) {
    loading.value = true
    try {
      const res = await $fetch(`/api/series/${slug}`)
      currentSeries.value = (res as any).data
      return currentSeries.value
    } finally { loading.value = false }
  }

  async function fetchDoc(slug: string, docId: string) {
    loading.value = true
    try {
      const res = await $fetch(`/api/series/${slug}/docs/${docId}`)
      currentDoc.value = (res as any).data
      return currentDoc.value
    } finally { loading.value = false }
  }

  function buildTree(docs: any[]) {
    const map = new Map<string, any>()
    const roots: any[] = []
    const sorted = [...docs].sort((a, b) => a.order - b.order)
    for (const doc of sorted) {
      map.set(doc.id, { ...doc, children: [] })
    }
    for (const doc of sorted) {
      const node = map.get(doc.id)!
      if (doc.parentId && map.has(doc.parentId)) {
        map.get(doc.parentId)!.children.push(node)
      } else {
        roots.push(node)
      }
    }
    return roots
  }

  return { seriesList, currentSeries, currentDoc, loading, fetchSeries, fetchSeriesBySlug, fetchDoc, buildTree }
}
```

---

### Task 5: Component — DocTree.vue (recursive file tree)

**Files:**
- Create: `components/DocTree.vue`

- [ ] **Step 1: Create recursive DocTree component**

```vue
<script setup lang="ts">
defineProps<{
  nodes: any[]
  activeId?: string
}>()
const emit = defineEmits<{
  select: [node: any]
  createDoc: [parentId?: string]
  createFolder: [parentId?: string]
}>()
</script>

<template>
  <div class="doc-tree">
    <div v-for="node in nodes" :key="node.id" class="doc-tree-node">
      <div
        class="doc-tree-item"
        :class="{ active: node.id === activeId, folder: node.type === 'folder' }"
        @click="emit('select', node)"
      >
        <span class="doc-tree-icon">
          <span v-if="node.type === 'folder'">{{ node.children?.length ? '📂' : '📁' }}</span>
          <span v-else>📄</span>
        </span>
        <span class="doc-tree-label">{{ node.title }}</span>
      </div>
      <div v-if="node.children?.length" class="doc-tree-children">
        <DocTree :nodes="node.children" :active-id="activeId" @select="(n) => emit('select', n)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.doc-tree { font-size: .8125rem; }
.doc-tree-node { }
.doc-tree-children { padding-left: 1rem; }
.doc-tree-item {
  display: flex; align-items: center; gap: .35rem;
  padding: .3rem .5rem; border-radius: 6px; cursor: pointer;
  transition: background .15s;
  color: var(--color-muted);
}
.doc-tree-item:hover { background: color-mix(in srgb, var(--color-accent) 8%, transparent); color: var(--color-foreground); }
.doc-tree-item.active { background: color-mix(in srgb, var(--color-accent) 14%, transparent); color: var(--color-accent); }
.doc-tree-icon { flex-shrink: 0; font-size: .8125rem; }
.doc-tree-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
```

---

### Task 6: Component — DocEditor.vue

**Files:**
- Create: `components/DocEditor.vue`

- [ ] **Step 1: Create DocEditor component** (reuses editor pattern from editor/new.vue)

```vue
<script setup lang="ts">
const props = defineProps<{
  content: string
  title: string
}>()
const emit = defineEmits<{
  update: [content: string]
  save: []
}>()

const localContent = ref(props.content)
watch(() => props.content, (v) => { localContent.value = v })
watch(localContent, (v) => { emit('update', v) })
</script>

<template>
  <div class="doc-editor">
    <textarea
      v-model="localContent"
      class="doc-editor-textarea"
      placeholder="Start writing markdown..."
    />
  </div>
</template>

<style scoped>
.doc-editor { display: flex; flex-direction: column; height: 100%; }
.doc-editor-textarea {
  flex: 1; width: 100%; padding: 1.25rem;
  background: transparent; border: none; outline: none; resize: none;
  font-family: 'Fira Code', monospace; font-size: .875rem; line-height: 1.7;
  color: var(--color-foreground);
}
.doc-editor-textarea::placeholder { color: var(--color-muted); opacity: .5; }
</style>
```

---

### Task 7: Page — /docs (series list)

**Files:**
- Create: `pages/docs/index.vue`

- [ ] **Step 1: Create series list page**

```vue
<script setup lang="ts">
const { seriesList, fetchSeries } = useSeries()
onMounted(() => fetchSeries())
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold">文档库</h1>
        <p class="text-xs mt-0.5" style="color: var(--color-muted)">系列文档、教程与知识库</p>
      </div>
      <NuxtLink to="/docs/new" class="text-xs px-3 py-1.5 rounded-lg" style="background: var(--color-accent); color: var(--color-on-accent)">
        + 新建系列
      </NuxtLink>
    </div>

    <div v-if="seriesList.length === 0" class="text-center py-12" style="color: var(--color-muted)">
      <p class="text-lg mb-2">📚</p>
      <p class="text-sm">还没有文档系列，创建一个吧</p>
    </div>

    <div v-else class="grid gap-3">
      <NuxtLink
        v-for="s in seriesList" :key="s.id"
        :to="`/docs/${s.slug}`"
        class="series-card"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">{{ s.icon || '📚' }}</span>
          <div>
            <p class="text-sm font-semibold">{{ s.title }}</p>
            <p v-if="s.description" class="text-[.625rem]" style="color: var(--color-muted)">{{ s.description }}</p>
          </div>
        </div>
        <span class="text-xs" style="color: var(--color-muted)">{{ s._count?.docs || 0 }} 篇</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.series-card {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem; border-radius: 12px;
  border: 1px solid var(--color-border); text-decoration: none;
  transition: border-color .2s;
  background: color-mix(in srgb, var(--color-surface) 30%, transparent);
}
.series-card:hover { border-color: var(--color-accent); }
</style>
```

---

### Task 8: Page — /docs/[slug] (series detail with tree + content)

**Files:**
- Create: `pages/docs/[slug].vue`

- [ ] **Step 1: Create series detail page with left tree + right content**

```vue
<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string
const { currentSeries, currentDoc, fetchSeriesBySlug, buildTree } = useSeries()
const auth = useAuthStore()

const tree = ref<any[]>([])
const activeDoc = ref<any>(null)
const showEditor = ref(false)
const editContent = ref('')

onMounted(async () => {
  const series = await fetchSeriesBySlug(slug)
  if (series?.docs) tree.value = buildTree(series.docs)
})

async function selectDoc(node: any) {
  if (node.type === 'folder') return
  const res = await $fetch(`/api/series/${slug}/docs/${node.id}`)
  activeDoc.value = (res as any).data
  editContent.value = activeDoc.value.content || ''
  showEditor.value = false
}

async function saveDoc() {
  if (!activeDoc.value) return
  await $fetch(`/api/series/${slug}/docs/${activeDoc.value.id}`, {
    method: 'PATCH',
    body: { content: editContent.value },
  })
  activeDoc.value.content = editContent.value
  showEditor.value = false
}

function toggleEdit() { showEditor.value = !showEditor.value }
</script>

<template>
  <div class="docs-page">
    <!-- Sidebar -->
    <aside class="docs-sidebar">
      <div class="docs-sidebar-header">
        <span class="text-sm font-semibold truncate">{{ currentSeries?.title }}</span>
        <NuxtLink :to="`/docs/${slug}/new`" class="text-xs" style="color: var(--color-accent)">+ 新建</NuxtLink>
      </div>
      <div class="docs-sidebar-tree">
        <DocTree :nodes="tree" :active-id="activeDoc?.id" @select="selectDoc" />
      </div>
    </aside>

    <!-- Content -->
    <main class="docs-main">
      <div v-if="!activeDoc" class="docs-empty">
        <p class="text-lg mb-2">📄</p>
        <p class="text-sm" style="color: var(--color-muted)">从左侧选择一个文档开始阅读</p>
      </div>

      <template v-else>
        <div class="docs-toolbar">
          <h2 class="text-sm font-semibold">{{ activeDoc.title }}</h2>
          <button v-if="!showEditor" @click="toggleEdit" class="docs-btn">✏️ 编辑</button>
          <template v-else>
            <button @click="saveDoc" class="docs-btn docs-btn-primary">💾 保存</button>
            <button @click="toggleEdit" class="docs-btn">取消</button>
          </template>
        </div>

        <div class="docs-content">
          <DocEditor
            v-if="showEditor"
            :content="activeDoc.content"
            :title="activeDoc.title"
            @update="(v) => editContent = v"
          />
          <div v-else class="docs-render markdown-content" v-html="activeDoc.content" />
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.docs-page {
  display: flex; gap: 0; min-height: calc(100vh - 5rem);
  max-width: 1200px; margin: 0 auto;
}
.docs-sidebar {
  width: 240px; flex-shrink: 0; border-right: 1px solid var(--color-border);
  display: flex; flex-direction: column;
}
.docs-sidebar-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: .75rem 1rem; border-bottom: 1px solid var(--color-border);
}
.docs-sidebar-tree {
  flex: 1; overflow-y: auto; padding: .5rem;
}
.docs-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.docs-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100%; padding: 4rem 2rem;
}
.docs-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: .75rem 1.25rem; border-bottom: 1px solid var(--color-border);
  gap: .75rem;
}
.docs-content { flex: 1; overflow-y: auto; padding: 1.25rem; }
.docs-btn {
  padding: .25rem .75rem; border-radius: 6px; font-size: .75rem;
  border: 1px solid var(--color-border); cursor: pointer;
  background: color-mix(in srgb, var(--color-surface) 40%, transparent);
  color: var(--color-muted); font-family: inherit;
  transition: border-color .2s;
}
.docs-btn:hover { border-color: var(--color-accent); }
.docs-btn-primary {
  background: var(--color-accent); color: var(--color-on-accent); border-color: var(--color-accent);
}
@media (max-width: 768px) {
  .docs-sidebar { display: none; }
  .docs-page { flex-direction: column; }
}
</style>
```

---

### Task 9: Page — /docs/[slug]/new (create doc/folder form)

**Files:**
- Create: `pages/docs/[slug]/new.vue`

- [ ] **Step 1: Create new doc/folder form**

```vue
<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string
const error = ref('')

const title = ref('')
const type = ref<'doc' | 'folder'>('doc')
const template = ref('blank')
const parentId = ref('')

const { currentSeries, fetchSeriesBySlug } = useSeries()
onMounted(async () => {
  const series = await fetchSeriesBySlug(slug)
  if (!series) router.replace('/docs')
})

async function submit() {
  if (!title.value.trim()) { error.value = '标题不能为空'; return }
  error.value = ''
  try {
    const res = await $fetch(`/api/series/${slug}/docs`, {
      method: 'POST',
      body: { title: title.value, type: type.value, template: template.value, parentId: parentId.value || undefined },
    }) as any
    router.push(`/docs/${slug}?select=${res.data.id}`)
  } catch (e: any) {
    error.value = e.data?.message || e.message || '创建失败'
  }
}
</script>

<template>
  <div class="max-w-md mx-auto space-y-6 pt-8">
    <div>
      <NuxtLink :to="`/docs/${slug}`" class="text-xs" style="color: var(--color-muted)">← 返回</NuxtLink>
      <h1 class="text-lg font-bold mt-2">新建文档</h1>
      <p class="text-xs" style="color: var(--color-muted)">在 {{ currentSeries?.title }} 中创建新内容</p>
    </div>

    <div class="space-y-4">
      <div>
        <label class="text-xs font-medium mb-1 block" style="color: var(--color-muted)">类型</label>
        <div class="flex gap-2">
          <button @click="type = 'doc'"
            class="flex-1 pz-card" :class="{ active: type === 'doc' }"
            style="justify-content: center; gap: .5rem; padding: .5rem">
            <span>📄 文档</span>
          </button>
          <button @click="type = 'folder'"
            class="flex-1 pz-card" :class="{ active: type === 'folder' }"
            style="justify-content: center; gap: .5rem; padding: .5rem">
            <span>📁 文件夹</span>
          </button>
        </div>
      </div>

      <div>
        <label class="text-xs font-medium mb-1 block" style="color: var(--color-muted)">标题</label>
        <input v-model="title" placeholder="输入标题" class="doc-input" />
      </div>

      <div v-if="type === 'doc'">
        <label class="text-xs font-medium mb-1 block" style="color: var(--color-muted)">模板</label>
        <select v-model="template" class="doc-input">
          <option value="blank">空白文档</option>
          <option value="api-ref">API 参考</option>
          <option value="guide">教程指南</option>
          <option value="note">笔记随笔</option>
        </select>
      </div>

      <p v-if="error" class="text-xs" style="color: var(--color-pink)">{{ error }}</p>

      <button @click="submit" class="w-full py-2 rounded-lg text-sm font-medium"
        style="background: var(--color-accent); color: var(--color-on-accent)">
        创建
      </button>
    </div>
  </div>
</template>

<style scoped>
.doc-input {
  width: 100%; padding: .5rem .75rem; border-radius: 8px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 30%, transparent);
  color: var(--color-foreground); font-family: inherit; font-size: .8125rem;
  outline: none; transition: border-color .2s;
}
.doc-input:focus { border-color: var(--color-accent); }
.doc-input option { background: var(--color-panel); }
.pz-card {
  display: flex; align-items: center; padding: .75rem 1rem; border-radius: 12px;
  border: 1px solid var(--color-border); cursor: pointer;
  background: color-mix(in srgb, var(--color-surface) 40%, transparent);
  text-align: left; font-family: inherit; font-size: .8125rem; color: var(--color-foreground);
}
.pz-card.active { border-color: var(--color-accent); background: color-mix(in srgb, var(--color-accent) 8%, transparent); }
</style>
```

---

### Task 10: Page — /docs/[slug]/edit/[docId] (full editor)

**Files:**
- Create: `pages/docs/[slug]/edit/[docId].vue`

- [ ] **Step 1: Create full editor page**

```vue
<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string
const docId = route.params.docId as string

const title = ref('')
const content = ref('')
const saving = ref(false)
const saved = ref(false)

onMounted(async () => {
  const res = await $fetch(`/api/series/${slug}/docs/${docId}`)
  const doc = (res as any).data
  if (!doc) { router.replace(`/docs/${slug}`); return }
  title.value = doc.title
  content.value = doc.content || ''
})

async function save() {
  saving.value = true; saved.value = false
  try {
    await $fetch(`/api/series/${slug}/docs/${docId}`, {
      method: 'PATCH',
      body: { content: content.value, title: title.value },
    })
    saved.value = true
    setTimeout(() => saved.value = false, 2000)
  } catch {} finally { saving.value = false }
}
</script>

<template>
  <div class="editor-page">
    <div class="editor-toolbar">
      <NuxtLink :to="`/docs/${slug}`" class="editor-back">← 返回</NuxtLink>
      <div class="flex items-center gap-2">
        <span v-if="saving" class="text-xs" style="color: var(--color-muted)">保存中…</span>
        <span v-if="saved" class="text-xs" style="color: #22c55e">已保存 ✓</span>
        <button @click="save" class="editor-save-btn">💾 保存</button>
      </div>
    </div>

    <div class="editor-body">
      <div class="editor-title-row">
        <input v-model="title" class="editor-title-input" placeholder="文档标题" />
      </div>
      <textarea
        v-model="content"
        class="editor-textarea"
        placeholder="用 Markdown 写点什么…"
      />
    </div>
  </div>
</template>

<style scoped>
.editor-page { display: flex; flex-direction: column; height: calc(100vh - 4rem); }
.editor-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: .5rem 1.25rem; border-bottom: 1px solid var(--color-border);
}
.editor-back { font-size: .8125rem; color: var(--color-muted); text-decoration: none; }
.editor-back:hover { color: var(--color-foreground); }
.editor-save-btn {
  padding: .35rem .9rem; border-radius: 8px; font-size: .8125rem; font-weight: 500;
  background: var(--color-accent); color: var(--color-on-accent); border: none; cursor: pointer;
  font-family: inherit;
}
.editor-body { flex: 1; display: flex; flex-direction: column; padding: 1.25rem; max-width: 800px; margin: 0 auto; width: 100%; }
.editor-title-row { margin-bottom: 1rem; }
.editor-title-input {
  width: 100%; font-size: 1.5rem; font-weight: 700; line-height: 1.3;
  background: transparent; border: none; outline: none; color: var(--color-primary);
  font-family: inherit;
}
.editor-title-input::placeholder { color: var(--color-muted); opacity: .4; }
.editor-textarea {
  flex: 1; width: 100%; padding: 0; resize: none; outline: none;
  background: transparent; border: none;
  font-family: 'Fira Code', monospace; font-size: .875rem; line-height: 1.8;
  color: var(--color-foreground);
  tab-size: 2;
}
.editor-textarea::placeholder { color: var(--color-muted); opacity: .4; }
</style>
```

---

### Task 11: Navigation — add /docs link

**Files:**
- Modify: `layouts/default.vue`

- [ ] **Step 1: Add /docs link to navLinks array**

Find the `navLinks` array and add:

```typescript
{ label: '文档', to: '/docs' },
```

---

### Task 12: Page — create docs library root page (if /docs/index.vue handles this, also add a simple create series modal)

**Files:**
- Modify: `pages/docs/index.vue`

The series list page already has a "+ 新建系列" link pointing to `/docs/new`. We need to create that page.

- [ ] **Step 1: Create /docs/new page for creating a series**

```vue
<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const router = useRouter()
const title = ref('')
const description = ref('')
const error = ref('')

async function submit() {
  if (!title.value.trim()) { error.value = '标题不能为空'; return }
  error.value = ''
  try {
    const res = await $fetch('/api/series', {
      method: 'POST',
      body: { title: title.value, description: description.value },
    }) as any
    router.push(`/docs/${res.data.slug}`)
  } catch (e: any) {
    error.value = e.data?.message || e.message || '创建失败'
  }
}
</script>

<template>
  <div class="max-w-md mx-auto space-y-6 pt-8">
    <div>
      <NuxtLink to="/docs" class="text-xs" style="color: var(--color-muted)">← 返回</NuxtLink>
      <h1 class="text-lg font-bold mt-2">新建系列</h1>
      <p class="text-xs" style="color: var(--color-muted)">创建一个文档系列</p>
    </div>

    <div class="space-y-4">
      <div>
        <label class="text-xs font-medium mb-1 block" style="color: var(--color-muted)">标题</label>
        <input v-model="title" placeholder="系列名称" class="doc-input" />
      </div>
      <div>
        <label class="text-xs font-medium mb-1 block" style="color: var(--color-muted)">描述（可选）</label>
        <input v-model="description" placeholder="简短说明" class="doc-input" />
      </div>
      <p v-if="error" class="text-xs" style="color: var(--color-pink)">{{ error }}</p>
      <button @click="submit" class="w-full py-2 rounded-lg text-sm font-medium"
        style="background: var(--color-accent); color: var(--color-on-accent)">
        创建
      </button>
    </div>
  </div>
</template>

<style scoped>
.doc-input {
  width: 100%; padding: .5rem .75rem; border-radius: 8px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 30%, transparent);
  color: var(--color-foreground); font-family: inherit; font-size: .8125rem;
  outline: none;
}
.doc-input:focus { border-color: var(--color-accent); }
</style>
```

---

### Task 13: Final — prisma push + dev server verification

- [ ] **Step 1: Run prisma push again to ensure clean DB**

```bash
cd e:\Sstellara\stellara-nuxt && npx prisma db push --accept-data-loss
```

- [ ] **Step 2: Start dev server and verify**

```bash
cd e:\Sstellara\stellara-nuxt && npx nuxt dev --port 3013
```

Expected: No compilation errors, `/docs` loads, can create series → create doc → edit doc → save.

- [ ] **Step 3: Manual smoke test**

Create a series → verify it shows in list → enter series → see empty tree → create a doc → see it in tree → click to read → click edit → save → verify content persists on reload.
