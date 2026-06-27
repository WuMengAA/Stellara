<script setup lang="ts">
const { seriesList, fetchSeries } = useSeries()
const deleteSlug = ref('')
const deleteTitle = ref('')
const showDelete = ref(false)

onMounted(() => fetchSeries())

function confirmDelete(s: any, e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  deleteSlug.value = s.slug
  deleteTitle.value = s.title
  showDelete.value = true
}

async function doDeleteSeries() {
  await $fetch(`/api/series/${deleteSlug.value}`, { method: 'DELETE' })
  showDelete.value = false
  fetchSeries()
}
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
        <div class="flex items-center gap-3 min-w-0">
          <span class="text-2xl flex-shrink-0">{{ s.icon || '📚' }}</span>
          <div class="min-w-0">
            <p class="text-sm font-semibold truncate">{{ s.title }}</p>
            <p v-if="s.description" class="text-[.625rem] truncate" style="color: var(--color-muted)">{{ s.description }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-xs" style="color: var(--color-muted)">{{ s._count?.docs || 0 }} 篇</span>
          <button class="series-del" title="删除系列" @click="(e) => confirmDelete(s, e)">🗑️</button>
        </div>
      </NuxtLink>
    </div>
  </div>

  <ConfirmDialog
    :show="showDelete" title="删除系列" danger
    :message="`确定要删除「${deleteTitle}」吗？其中的所有文档也会被删除，此操作不可撤销。`"
    @confirm="doDeleteSeries" @cancel="showDelete = false"
  />
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
.series-del {
  background: none; border: none; cursor: pointer; font-size: .8125rem;
  padding: .1rem; border-radius: 4px; line-height: 1;
  opacity: .4; transition: opacity .2s;
}
.series-del:hover { opacity: 1; }
</style>
