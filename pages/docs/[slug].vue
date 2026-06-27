<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string
const { currentSeries, fetchSeriesBySlug, buildTree } = useSeries()
const { render: renderMd } = useMarkdown()
const auth = useAuthStore()

const tree = ref<any[]>([])
const activeDoc = ref<any>(null)
const showEditor = ref(false)
const editContent = ref('')
const showDocDelete = ref(false)
const showSeriesDelete = ref(false)

onMounted(async () => {
  const series = await fetchSeriesBySlug(slug)
  if (series?.docs) tree.value = buildTree(series.docs)
  if (route.query.select) {
    const doc = series?.docs?.find((d: any) => d.id === route.query.select)
    if (doc) await selectDoc(doc)
  }
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

async function reorderDoc(dragId: string, targetId: string) {
  const docs = currentSeries.value?.docs
  if (!docs) return
  const dragIdx = docs.findIndex((d: any) => d.id === dragId)
  const targetIdx = docs.findIndex((d: any) => d.id === targetId)
  if (dragIdx === -1 || targetIdx === -1) return
  const temp = docs[dragIdx].order
  await Promise.all([
    $fetch(`/api/series/${slug}/docs/${dragId}`, { method: 'PATCH', body: { order: docs[targetIdx].order } }),
    $fetch(`/api/series/${slug}/docs/${targetId}`, { method: 'PATCH', body: { order: temp } }),
  ])
  const series = await fetchSeriesBySlug(slug)
  if (series?.docs) tree.value = buildTree(series.docs)
}

async function confirmDeleteDoc() {
  if (!activeDoc.value) return
  await $fetch(`/api/series/${slug}/docs/${activeDoc.value.id}`, { method: 'DELETE' })
  showDocDelete.value = false
  const series = await fetchSeriesBySlug(slug)
  if (series?.docs) tree.value = buildTree(series.docs)
  activeDoc.value = null
}

async function confirmDeleteSeries() {
  await $fetch(`/api/series/${slug}`, { method: 'DELETE' })
  showSeriesDelete.value = false
  router.push('/docs')
}
</script>

<template>
  <div class="docs-page">
    <!-- Sidebar -->
    <aside class="docs-sidebar">
      <div class="docs-sidebar-header">
        <div class="flex items-center gap-1.5 min-w-0">
          <NuxtLink to="/docs" class="text-xs flex-shrink-0" style="color: var(--color-muted)">←</NuxtLink>
          <span class="text-sm font-semibold truncate">{{ currentSeries?.title }}</span>
        </div>
        <div class="flex items-center gap-1">
          <button class="docs-icon-btn" title="删除系列" @click="showSeriesDelete = true">🗑️</button>
          <NuxtLink :to="`/docs/${slug}/new`" class="text-xs flex-shrink-0" style="color: var(--color-accent)">+ 新建</NuxtLink>
        </div>
      </div>
      <div class="docs-sidebar-tree">
        <DocTree :nodes="tree" :active-id="activeDoc?.id" @select="selectDoc" @delete="(node) => { activeDoc = node; showDocDelete = true }" @reorder="reorderDoc" />
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
          <div class="flex items-center gap-2 min-w-0">
            <h2 class="text-sm font-semibold truncate">{{ activeDoc.title }}</h2>
            <span
              v-if="activeDoc.articleId"
              class="article-badge"
              title="此文档收录自博客文章"
            >📝 已收录</span>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <button v-if="!showEditor" class="docs-icon-btn" title="删除文档" @click="showDocDelete = true">🗑️</button>
            <NuxtLink v-if="!showEditor" :to="`/docs/${slug}/edit/${activeDoc.id}`" class="docs-btn">✏️ 编辑</NuxtLink>
            <template v-else>
              <button @click="saveDoc" class="docs-btn docs-btn-primary">💾 保存</button>
              <button @click="toggleEdit" class="docs-btn">取消</button>
            </template>
          </div>
        </div>

        <div class="docs-content">
          <DocEditor
            v-if="showEditor"
            :content="activeDoc.content"
            :title="activeDoc.title"
            @update="(v) => editContent = v"
          />
          <div v-else class="markdown-content" v-html="renderMd(activeDoc.content || '')" />
        </div>
      </template>
    </main>
  </div>

  <ConfirmDialog
    :show="showDocDelete" title="删除文档" danger
    :message="`确定要删除「${activeDoc?.title || ''}」吗？此操作不可撤销。`"
    @confirm="confirmDeleteDoc" @cancel="showDocDelete = false"
  />
  <ConfirmDialog
    :show="showSeriesDelete" title="删除系列" danger
    :message="`确定要删除系列「${currentSeries?.title || ''}」吗？其中的所有文档也会被删除，此操作不可撤销。`"
    @confirm="confirmDeleteSeries" @cancel="showSeriesDelete = false"
  />
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
  padding: .75rem 1rem; gap: .5rem;
  border-bottom: 1px solid var(--color-border);
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
.docs-content .markdown-content { max-width: 720px; }
.docs-btn {
  padding: .25rem .75rem; border-radius: 6px; font-size: .75rem;
  border: 1px solid var(--color-border); cursor: pointer; text-decoration: none;
  background: color-mix(in srgb, var(--color-surface) 40%, transparent);
  color: var(--color-muted); font-family: inherit;
  transition: border-color .2s;
}
.docs-btn:hover { border-color: var(--color-accent); }
.docs-btn-primary {
  background: var(--color-accent); color: var(--color-on-accent); border-color: var(--color-accent);
}
.docs-icon-btn {
  background: none; border: none; cursor: pointer; font-size: .8125rem;
  padding: .15rem .25rem; border-radius: 4px; line-height: 1;
  opacity: .5; transition: opacity .2s;
}
.docs-icon-btn:hover { opacity: 1; }
.article-badge {
  font-size: .625rem; padding: .1rem .4rem; border-radius: 4px;
  background: color-mix(in srgb, var(--color-accent) 14%, transparent);
  color: var(--color-accent); white-space: nowrap; flex-shrink: 0;
}
@media (max-width: 768px) {
  .docs-sidebar { display: none; }
  .docs-page { flex-direction: column; }
}
</style>
