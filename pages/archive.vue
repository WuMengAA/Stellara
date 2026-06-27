<script setup lang="ts">
const { data } = await useFetch('/api/articles', { params: { perPage: 100 } }) as any
const articles = computed(() => (data.value?.articles || []))

const groups = computed(() => {
  const map: Record<string, Record<string, any[]>> = {}
  for (const a of articles.value) {
    const d = new Date(a.createdAt)
    const y = String(d.getFullYear())
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!map[y]) map[y] = {}
    if (!map[y][m]) map[y][m] = []
    map[y][m].push(a)
  }
  return Object.entries(map).reverse().map(([year, months]) => ({
    year,
    months: Object.entries(months).reverse().map(([key, items]) => ({ key, items })),
  }))
})

const totalCount = computed(() => articles.value.length)
</script>

<template>
  <div class="max-w-lg mx-auto space-y-8">
    <div class="text-center space-y-2 pt-4">
      <h1 class="text-2xl md:text-3xl font-bold">归档</h1>
      <p class="text-xs" style="color: var(--color-muted)">共 {{ totalCount }} 篇文章</p>
    </div>

    <div v-if="!articles.length" class="text-center py-12 text-sm" style="color: var(--color-muted)">
      暂无内容
    </div>

    <div v-for="group in groups" :key="group.year" class="space-y-4">
      <div class="flex items-center gap-2">
        <span class="text-lg font-bold" style="color: var(--color-accent)">{{ group.year }}</span>
        <span class="text-xs" style="color: var(--color-muted)">{{ group.months.reduce((s, m) => s + m.items.length, 0) }} 篇</span>
      </div>

      <div v-for="month in group.months" :key="month.key" class="space-y-1">
        <p class="text-[.625rem] font-semibold uppercase tracking-wider px-1" style="color: var(--color-muted)">
          {{ month.key }}
        </p>
        <NuxtLink v-for="a in month.items" :key="a.id" :to="`/blog/${a.slug}`"
          class="ar-card flex items-center justify-between gap-3">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ a.title }}</p>
            <p class="text-[.625rem] mt-0.5" style="color: var(--color-muted)">{{ new Date(a.createdAt).toLocaleDateString('zh-CN') }}</p>
          </div>
          <span v-if="a.tags?.length" class="text-[.625rem] shrink-0" style="color: var(--color-muted)">
            {{ a.tags[0]?.tag?.name }}{{ a.tags.length > 1 ? ` +${a.tags.length - 1}` : '' }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ar-card {
  display: flex; padding: .625rem .75rem; border-radius: 10px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 40%, transparent);
  backdrop-filter: blur(8px);
  text-decoration: none;
  transition: border-color .2s, background .2s;
}
.ar-card:hover { border-color: var(--color-accent); background: color-mix(in srgb, var(--color-accent) 6%, transparent); }
</style>
