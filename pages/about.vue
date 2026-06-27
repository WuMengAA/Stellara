<script setup lang="ts">
const theme = useTheme()
const { data: stats } = await useFetch('/api/articles?perPage=1')
const totalArticles = computed(() => (stats.value as any)?.meta?.total || 0)
const { data: tags } = await useFetch('/api/tags')
const tagCount = computed(() => (tags.value as any)?.data?.length || 0)
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-10">
    <section class="text-center space-y-4 pt-4">
      <h1 class="text-3xl md:text-4xl font-bold">关于 Stellara</h1>
      <p class="text-sm leading-relaxed" style="color: var(--color-muted)">
        <span class="text-gradient-glow font-semibold">Stellara</span> 是一个个人知识与创作分享平台。
        记录技术探索路上的点滴思考、设计灵感的闪现瞬间，以及那些值得被书写的时刻。
      </p>
    </section>

    <section class="ab-card">
      <h2 class="ab-h">技术栈</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div v-for="s in [
          { name:'Nuxt 3', desc:'前端框架' }, { name:'Vue 3', desc:'UI 库' },
          { name:'Prisma', desc:'ORM' }, { name:'SQLite', desc:'数据库' },
          { name:'Vite', desc:'构建工具' }, { name:'Tailwind', desc:'CSS 框架' },
        ]" :key="s.name" class="ab-tech">
          <span class="text-sm font-semibold">{{ s.name }}</span>
          <span class="text-[.625rem]" style="color: var(--color-muted)">{{ s.desc }}</span>
        </div>
      </div>
    </section>

    <section class="ab-card">
      <h2 class="ab-h">数据统计</h2>
      <div class="flex gap-6 justify-center">
        <div class="flex flex-col items-center"><span class="text-2xl font-bold" style="color: var(--color-accent)">{{ totalArticles }}</span><span class="text-xs" style="color: var(--color-muted)">文章</span></div>
        <div class="w-px bg-[var(--color-border)]"></div>
        <div class="flex flex-col items-center"><span class="text-2xl font-bold" style="color: var(--color-secondary)">{{ tagCount }}</span><span class="text-xs" style="color: var(--color-muted)">标签</span></div>
        <div class="w-px bg-[var(--color-border)]"></div>
        <div class="flex flex-col items-center"><span class="text-2xl font-bold" style="color: var(--color-tertiary)">1</span><span class="text-xs" style="color: var(--color-muted)">作者</span></div>
      </div>
    </section>

    <section class="ab-card">
      <h2 class="ab-h">致谢</h2>
      <p class="text-xs leading-relaxed" style="color: var(--color-muted)">
        感谢 Nuxt 生态和所有开源贡献者。每一行代码都站在巨人的肩膀上。
      </p>
    </section>
  </div>
</template>

<style scoped>
.ab-card {
  padding: 1.5rem; border-radius: 16px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 50%, transparent);
  backdrop-filter: blur(8px);
}
.ab-h {
  font-size: .75rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .08em; color: var(--color-muted); margin-bottom: 1rem;
}
.ab-tech {
  padding: .75rem; border-radius: 10px;
  border: 1px solid var(--color-border); display: flex;
  flex-direction: column; gap: .125rem;
}
</style>
