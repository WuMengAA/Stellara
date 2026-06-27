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
