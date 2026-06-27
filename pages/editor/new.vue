<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore()
const router = useRouter()

const title = ref('')
const content = ref('')
const categorySlug = ref('uncategorized')
const saving = ref(false)
const error = ref('')

const { data: categories } = await useFetch('/api/articles/categories')

const draftKey = 'editor-draft'
onMounted(() => {
  const saved = localStorage.getItem(draftKey)
  if (saved) {
    try {
      const d = JSON.parse(saved)
      if (d.title || d.content) { title.value = d.title; content.value = d.content }
    } catch {}
  }
})
watch([title, content], () => {
  localStorage.setItem(draftKey, JSON.stringify({ title: title.value, content: content.value }))
})

async function save(status: 'draft' | 'published') {
  error.value = ''
  if (!title.value.trim()) { error.value = '标题不能为空'; return }
  saving.value = true
  try {
    const res = await $fetch('/api/articles', {
      method: 'POST',
      body: { title: title.value, content: content.value, categorySlug: categorySlug.value, status },
    }) as any
    localStorage.removeItem(draftKey)
    router.push(`/editor/${res.data.id}`)
  } catch (e: any) {
    error.value = e.data?.message || e.message || '保存失败'
  }
  saving.value = false
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-4">
    <div class="flex items-center justify-between">
      <NuxtLink to="/editor" class="text-xs" style="color: var(--color-muted)">← 返回</NuxtLink>
      <div class="flex items-center gap-2">
        <button @click="save('draft')" :disabled="saving" class="px-3 py-1.5 rounded-full text-xs border" style="border-color:var(--color-border);color:var(--color-muted);background:transparent;cursor:pointer">{{ saving ? '保存中…' : '存草稿' }}</button>
        <button @click="save('published')" :disabled="saving" class="b6-btn" style="height:32px">
          <span class="b6-bg"></span>
          <span class="b6-wrap"><span class="b6-outline"></span><span class="b6-content" style="font-size:11px;padding:0 .875rem">发布</span></span>
        </button>
      </div>
    </div>

    <div v-if="error" class="text-xs" style="color:#ef4444">{{ error }}</div>

    <div class="ed-card space-y-4">
      <input v-model="title" placeholder="文章标题…" class="ed-title" />

      <div class="flex items-center gap-2">
        <select v-model="categorySlug" class="ed-select">
          <option value="uncategorized">未分类</option>
          <option v-for="c in (categories as any)?.data || []" :key="c.slug" :value="c.slug">{{ c.name }}</option>
        </select>
      </div>

      <textarea v-model="content" placeholder="开始写作…（支持 Markdown）" class="ed-textarea"></textarea>
      <p class="text-[.625rem] text-right" style="color: var(--color-muted)">{{ content.length }} 字</p>
    </div>
  </div>
</template>

<style scoped>
.ed-card {
  padding: 1.5rem; border-radius: 16px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 50%, transparent);
  backdrop-filter: blur(8px);
}
.ed-title {
  width: 100%; border: none; outline: none; background: transparent;
  font-size: 1.25rem; font-weight: 700; color: var(--color-foreground);
}
.ed-title::placeholder { color: var(--color-muted); }
.ed-select {
  padding: .375rem .75rem; border-radius: 8px;
  border: 1px solid var(--color-border); background: transparent;
  color: var(--color-foreground); font-size: .75rem; outline: none;
}
.ed-textarea {
  width: 100%; min-height: 400px; border: none; outline: none;
  background: transparent; color: var(--color-foreground);
  font-size: .875rem; line-height: 1.8; resize: vertical;
  font-family: 'SF Mono', 'Fira Code', monospace;
}
.ed-textarea::placeholder { color: var(--color-muted); }
</style>
