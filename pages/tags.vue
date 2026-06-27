<script setup lang="ts">
const { data } = await useFetch('/api/tags') as any
const tags = computed(() => (data.value?.data || []).filter((t: any) => t.usageCount > 0))

const maxUsage = computed(() => Math.max(1, ...tags.value.map((t: any) => t.usageCount)))

function size(usage: number): string {
  const ratio = usage / maxUsage.value
  if (ratio > 0.8) return 'text-base font-bold'
  if (ratio > 0.5) return 'text-sm font-semibold'
  if (ratio > 0.3) return 'text-xs font-medium'
  return 'text-[.6875rem]'
}
</script>

<template>
  <div class="max-w-lg mx-auto space-y-6">
    <div class="text-center space-y-2 pt-4">
      <h1 class="text-2xl md:text-3xl font-bold">标签</h1>
      <p class="text-xs" style="color: var(--color-muted)">共 {{ tags.length }} 个标签</p>
    </div>

    <div v-if="!tags.length" class="text-center py-12 text-sm" style="color: var(--color-muted)">
      暂无标签
    </div>

    <div class="flex flex-wrap gap-2 justify-center">
      <NuxtLink v-for="t in tags" :key="t.slug" :to="`/blog?tag=${t.slug}`"
        class="tg-chip" :class="size(t.usageCount)"
        :style="{ borderColor: t.color ? `${t.color}40` : 'var(--color-border)', color: t.color || 'var(--color-foreground)' }">
        {{ t.name }}
        <sup class="text-[.625rem] opacity-60">{{ t.usageCount }}</sup>
      </NuxtLink>
    </div>

    <div class="mt-8 space-y-4">
      <h2 class="text-sm font-semibold text-center" style="color: var(--color-muted)">标签列表</h2>
      <div class="space-y-2">
        <NuxtLink v-for="t in tags" :key="t.slug" :to="`/blog?tag=${t.slug}`"
          class="tg-row">
          <span class="text-sm font-medium">{{ t.name }}</span>
          <div class="flex items-center gap-2">
            <span class="text-xs" style="color: var(--color-muted)">{{ t.usageCount }} 篇文章</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-muted)"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tg-chip {
  display: inline-flex; align-items: center; gap: 2px;
  padding: .375rem .75rem; border-radius: 999px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 50%, transparent);
  backdrop-filter: blur(8px);
  text-decoration: none; transition: all .2s;
}
.tg-chip:hover { border-color: var(--color-accent); background: color-mix(in srgb, var(--color-accent) 8%, transparent); }

.tg-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: .625rem .75rem; border-radius: 10px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 40%, transparent);
  backdrop-filter: blur(8px);
  text-decoration: none; transition: border-color .2s;
}
.tg-row:hover { border-color: var(--color-accent); }
</style>
