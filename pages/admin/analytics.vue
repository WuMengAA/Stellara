<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: statsRes } = await useFetch('/api/stats')
const stats = computed(() => (statsRes.value as any)?.data || {})

const nf = new Intl.NumberFormat('en-US')

const metricCards = computed(() => [
  { label: '文章总数', value: nf.format(stats.value.totalArticles || 0), icon: 'file-text' },
  { label: '总阅读量', value: nf.format(stats.value.totalViews || 0), icon: 'eye' },
  { label: '评论总数', value: nf.format(stats.value.totalComments || 0), icon: 'message-square' },
  { label: '用户总数', value: nf.format(stats.value.totalUsers || 0), icon: 'users' },
])

const topArticles = computed(() => stats.value.topArticles || [])
const viewsByDay = computed(() => stats.value.viewsByDay || [])
const maxView = computed(() => Math.max(...viewsByDay.value.map((d: any) => d.count), 1))
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-lg font-semibold" :style="{ color: 'var(--color-foreground)' }">Analytics</h1>
      <p class="text-sm mt-1" :style="{ color: 'var(--color-muted)' }">阅读统计与趋势</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="card in metricCards" :key="card.label"
        class="rounded-xl border p-5 transition-all"
        :style="{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium uppercase tracking-wider" :style="{ color: 'var(--color-muted)' }">
            {{ card.label }}
          </span>
          <svg class="w-4 h-4" :style="{ color: 'var(--color-muted)' }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path v-if="card.icon === 'file-text'" stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            <path v-if="card.icon === 'eye'" stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path v-if="card.icon === 'message-square'" stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            <path v-if="card.icon === 'users'" stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold tracking-tight" :style="{ color: 'var(--color-foreground)' }">
          {{ card.value }}
        </p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-xl border p-5" :style="{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
        <h2 class="text-sm font-semibold mb-4" :style="{ color: 'var(--color-foreground)' }">阅读量 TOP10</h2>
        <div v-if="!topArticles.length" class="text-center py-8 text-xs" :style="{ color: 'var(--color-muted)' }">
          暂无数据
        </div>
        <div v-else class="space-y-2">
          <div v-for="(article, i) in topArticles" :key="article.slug"
            class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-[var(--color-surface-2)]/50">
            <span class="w-5 text-center text-xs font-bold shrink-0" :style="{ color: i < 3 ? 'var(--color-accent)' : 'var(--color-muted)' }">
              {{ i + 1 }}
            </span>
            <NuxtLink :to="`/blog/${article.slug}`" class="flex-1 text-xs font-medium truncate hover:underline"
              :style="{ color: 'var(--color-foreground)' }">
              {{ article.title }}
            </NuxtLink>
            <span class="text-xs shrink-0" :style="{ color: 'var(--color-muted)' }">
              {{ nf.format(article.viewCount) }}
            </span>
          </div>
        </div>
      </div>

      <div class="rounded-xl border p-5" :style="{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
        <h2 class="text-sm font-semibold mb-4" :style="{ color: 'var(--color-foreground)' }">每日阅读趋势（近30天）</h2>
        <div v-if="!viewsByDay.length" class="text-center py-8 text-xs" :style="{ color: 'var(--color-muted)' }">
          暂无数据
        </div>
        <div v-else class="flex items-end gap-1 h-40">
          <div v-for="day in viewsByDay" :key="day.date" class="flex-1 flex flex-col items-center gap-1">
            <div
              class="w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer relative group"
              :style="{
                height: Math.max(4, (day.count / maxView) * 100) + '%',
                background: 'var(--color-accent)',
                opacity: day.count > 0 ? 0.85 : 0.15,
              }">
              <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                :style="{ color: 'var(--color-muted)' }">
                {{ nf.format(day.count) }}
              </div>
            </div>
            <span class="text-[8px] leading-tight" :style="{ color: 'var(--color-muted)', opacity: 0.6 }">
              {{ day.date.slice(5) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
