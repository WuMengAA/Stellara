<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const route = useRoute()
const router = useRouter()

const { data: article } = await useFetch(`/api/articles/${route.params.id}`) as any
const title = ref(article.value?.data?.title || '')
const content = ref(article.value?.data?.content || '')
const categorySlug = ref(article.value?.data?.categorySlug || 'uncategorized')
const saving = ref(false)
const error = ref('')

const { data: categories } = await useFetch('/api/articles/categories')

watch(() => article.value, (a) => {
  if (a?.data) { title.value = a.data.title; content.value = a.data.content; categorySlug.value = a.data.categorySlug || 'uncategorized' }
})

async function save(status?: 'draft' | 'published') {
  error.value = ''
  saving.value = true
  try {
    await $fetch(`/api/articles/${route.params.id}`, {
      method: 'PATCH',
      body: { title: title.value, content: content.value, categorySlug: categorySlug.value, ...(status ? { status } : {}) },
    })
    router.push('/editor')
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
        <button @click="save()" :disabled="saving" class="px-3 py-1.5 rounded-full text-xs border" style="border-color:var(--color-border);color:var(--color-muted);background:transparent;cursor:pointer">{{ saving ? '保存中…' : '保存' }}</button>
        <button @click="save('published')" :disabled="saving" class="b6-btn" style="height:32px">
          <span class="b6-bg"></span>
          <span class="b6-wrap"><span class="b6-outline"></span><span class="b6-content" style="font-size:11px;padding:0 .875rem">发布</span></span>
        </button>
      </div>
    </div>

    <div v-if="error" class="text-xs" style="color:#ef4444">{{ error }}</div>

    <div class="ed-card space-y-4">
      <input v-model="title" placeholder="文章标题…" class="ed-title" />
      <select v-model="categorySlug" class="ed-select">
        <option value="uncategorized">未分类</option>
        <option v-for="c in (categories as any)?.data || []" :key="c.slug" :value="c.slug">{{ c.name }}</option>
      </select>
      <textarea v-model="content" placeholder="开始写作…" class="ed-textarea"></textarea>
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
