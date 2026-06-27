<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data, refresh } = await useFetch('/api/media', { params: { perPage: 50 } }) as any
const items = computed(() => (data.value?.data || []))
const total = computed(() => data.value?.meta?.total || 0)

const url = ref('')
const originalName = ref('')

async function add() {
  if (!url.value.trim()) return
  await $fetch('/api/media', {
    method: 'POST',
    body: { url: url.value, originalName: originalName.value || undefined },
  })
  url.value = ''
  originalName.value = ''
  refresh()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold">附件管理</h2>
      <span class="text-xs" style="color: var(--color-muted)">共 {{ total }} 个文件</span>
    </div>

    <div class="flex gap-2 items-end">
      <div class="flex-1 space-y-1">
        <label class="text-xs" style="color: var(--color-muted)">文件 URL</label>
        <input v-model="url" placeholder="https://example.com/image.png" class="ad-input" />
      </div>
      <div class="space-y-1">
        <label class="text-xs" style="color: var(--color-muted)">文件名（可选）</label>
        <input v-model="originalName" placeholder="文件名" class="ad-input" style="width:150px" />
      </div>
      <button @click="add" class="ad-btn">添加</button>
    </div>

    <div v-if="!items.length" class="ad-card text-center py-12">
      <p class="text-sm" style="color: var(--color-muted)">暂无附件</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <div v-for="m in items" :key="m.id" class="ad-card group relative">
        <div class="aspect-square rounded-lg overflow-hidden bg-[var(--color-surface)] mb-2">
          <img v-if="m.type === 'image'" :src="m.url" :alt="m.originalName || m.filename"
            class="w-full h-full object-cover" loading="lazy" />
          <div v-else class="w-full h-full flex items-center justify-center text-2xl" style="color: var(--color-muted)">
            📄
          </div>
        </div>
        <p class="text-xs font-medium truncate">{{ m.originalName || m.filename }}</p>
        <p class="text-[.625rem]" style="color: var(--color-muted)">{{ (m.size ? (m.size / 1024).toFixed(1) + ' KB' : '') }} {{ m.mimeType || '' }}</p>
        <p class="text-[.625rem] mt-0.5" style="color: var(--color-muted)">{{ new Date(m.createdAt).toLocaleDateString('zh-CN') }}</p>
        <div class="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button @click="navigator.clipboard?.writeText(m.url)" class="ad-btn text-xs">复制链接</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ad-card {
  padding: .75rem; border-radius: 12px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 40%, transparent);
  backdrop-filter: blur(8px);
}
.ad-input {
  width: 100%; padding: .375rem .625rem; border-radius: 8px;
  border: 1px solid var(--color-border); background: transparent;
  color: var(--color-foreground); font-size: .8125rem; outline: none;
}
.ad-input:focus { border-color: var(--color-accent); }
.ad-btn {
  padding: .375rem 1rem; border-radius: 8px; border: none;
  background: var(--color-accent); color: var(--color-on-accent);
  font-size: .8125rem; cursor: pointer; white-space: nowrap;
  height: 34px;
}
</style>
