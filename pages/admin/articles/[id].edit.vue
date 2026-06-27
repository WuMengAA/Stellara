<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { render } = useMarkdown()
const authFetch = useAuthFetch()
const router = useRouter()
const route = useRoute()

const title = ref('')
const content = ref('')
const categorySlug = ref('uncategorized')
const status = ref<'draft' | 'published'>('draft')
const saving = ref(false)
const loading = ref(true)
const preview = ref(true)

const previewHtml = computed(() => render(content.value))

const slug = computed(() => {
  return title.value
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'article'
})

async function loadArticle() {
  loading.value = true
  try {
    const res = await authFetch.get<any>(`/api/articles/${route.params.id}`)
    const article = res.data
    title.value = article.title
    content.value = article.content
    categorySlug.value = article.categorySlug || 'uncategorized'
    status.value = article.status
  } catch {
    router.push('/admin/articles')
  }
  loading.value = false
}

loadArticle()

async function submit() {
  if (!title.value.trim() || !content.value.trim()) return
  saving.value = true
  try {
    await authFetch.patch(`/api/articles/${route.params.id}`, {
      title: title.value.trim(),
      content: content.value,
      categorySlug: categorySlug.value,
      status: status.value,
    })
    router.push('/admin/articles')
  } catch (e: any) {
    console.error('Update failed', e)
  }
  saving.value = false
}

function publish() {
  status.value = 'published'
  submit()
}

function saveDraft() {
  status.value = 'draft'
  submit()
}

function insertMarkdown(prefix: string, suffix = '') {
  const el = document.querySelector('.editor-textarea') as HTMLTextAreaElement
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = content.value.slice(start, end)
  content.value = content.value.slice(0, start) + prefix + selected + suffix + content.value.slice(end)
  requestAnimationFrame(() => {
    el.focus()
    el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length)
  })
}
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center h-[calc(100vh-8rem)]">
    <span class="text-sm" style="color: var(--color-muted)">Loading article…</span>
  </div>

  <div v-else class="flex flex-col h-[calc(100vh-8rem)]">
    <div class="flex items-center gap-3 mb-4">
      <NuxtLink to="/admin/articles" class="p-1.5 rounded-lg transition-colors" style="color: var(--color-muted)">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </NuxtLink>
      <input v-model="title" type="text" placeholder="Article title…"
        class="flex-1 text-2xl font-bold bg-transparent outline-none border-none"
        style="color: var(--color-foreground)" />
    </div>

    <div class="flex items-center gap-1 px-1 py-1.5 mb-3 rounded-lg flex-wrap"
      :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }">
      <button @click="insertMarkdown('**', '**')" class="px-2.5 py-1 rounded text-xs font-bold transition-colors"
        style="color: var(--color-muted)" title="Bold">B</button>
      <button @click="insertMarkdown('*', '*')" class="px-2.5 py-1 rounded text-xs italic transition-colors"
        style="color: var(--color-muted)" title="Italic">I</button>
      <span class="w-px h-4 mx-1" :style="{ background: 'var(--color-border)' }"></span>
      <button @click="insertMarkdown('# ')" class="px-2.5 py-1 rounded text-xs font-semibold transition-colors"
        style="color: var(--color-muted)" title="Heading 1">H1</button>
      <button @click="insertMarkdown('## ')" class="px-2.5 py-1 rounded text-xs font-semibold transition-colors"
        style="color: var(--color-muted)" title="Heading 2">H2</button>
      <span class="w-px h-4 mx-1" :style="{ background: 'var(--color-border)' }"></span>
      <button @click="insertMarkdown('[', '](url)')" class="px-2.5 py-1 rounded text-xs transition-colors"
        style="color: var(--color-muted)" title="Link">🔗</button>
      <button @click="insertMarkdown('- ')" class="px-2.5 py-1 rounded text-xs transition-colors"
        style="color: var(--color-muted)" title="List">≡</button>
      <button @click="insertMarkdown('> ')" class="px-2.5 py-1 rounded text-xs transition-colors"
        style="color: var(--color-muted)" title="Blockquote">❝</button>
      <button @click="insertMarkdown('```\n', '\n```')" class="px-2.5 py-1 rounded text-xs transition-colors"
        style="color: var(--color-muted)" title="Code Block">&lt;/&gt;</button>
      <span class="w-px h-4 mx-1" :style="{ background: 'var(--color-border)' }"></span>
      <button @click="preview = !preview"
        class="px-2.5 py-1 rounded text-xs font-medium transition-colors ml-auto"
        :style="{ color: preview ? 'var(--color-accent)' : 'var(--color-muted)', background: preview ? 'var(--color-accent) / 10' : 'transparent' }">
        Preview
      </button>
    </div>

    <div class="flex-1 flex gap-4 min-h-0">
      <textarea v-model="content" placeholder="Start writing in Markdown…"
        class="editor-textarea flex-1 resize-none rounded-xl p-4 text-sm leading-relaxed outline-none"
        :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)' }" />

      <div v-if="preview" class="flex-1 overflow-y-auto rounded-xl p-4 markdown-content prose prose-sm max-w-none"
        :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }"
        v-html="previewHtml" />
    </div>

    <div class="flex items-center gap-3 mt-3 px-1 py-2.5 rounded-lg flex-wrap"
      :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }">
      <select v-model="categorySlug"
        class="text-xs px-3 py-1.5 rounded-lg outline-none"
        :style="{ background: 'var(--color-surface-2)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)' }">
        <option value="uncategorized">Uncategorized</option>
        <option value="tech">Tech</option>
        <option value="design">Design</option>
        <option value="life">Life</option>
        <option value="tutorial">Tutorial</option>
      </select>

      <span class="text-xs font-mono" style="color: var(--color-muted)">
        /{{ slug }}
      </span>

      <span class="flex-1"></span>

      <button @click="saveDraft" :disabled="saving"
        class="px-4 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
        :style="{ background: 'var(--color-surface-2)', color: 'var(--color-foreground)' }">
        {{ saving ? 'Saving…' : 'Save Draft' }}
      </button>

      <button @click="publish" :disabled="saving"
        class="px-4 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
        :style="{ background: 'var(--color-accent)', color: '#fff' }">
        {{ saving ? 'Publishing…' : 'Publish' }}
      </button>
    </div>
  </div>
</template>
