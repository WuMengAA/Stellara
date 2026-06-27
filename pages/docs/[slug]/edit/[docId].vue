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
