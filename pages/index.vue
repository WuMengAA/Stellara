<script setup lang="ts">
const { data: recent } = await useFetch('/api/articles?perPage=6')
const { data: pinnedData } = await useFetch('/api/articles?pinned=true&perPage=3')
const { data: tags } = await useFetch('/api/tags')

const posts = computed(() => (recent.value as any)?.data?.articles || [])
const pinnedPosts = computed(() => (pinnedData.value as any)?.data?.articles || [])
const tagList = computed(() => (tags.value as any)?.data || [])
const { extractExcerpt } = useMarkdown()

const featured = computed(() => posts.value[0] || null)
const rest = computed(() => posts.value.slice(1))

const heroContent = ref<HTMLElement>()
const heroVisible = ref(false)
onMounted(() => {
  const el = heroContent.value
  if (!el) return
  const obs = new IntersectionObserver(([entry]) => {
    heroVisible.value = entry.isIntersecting
  }, { threshold: 0.3 })
  obs.observe(el)
  onUnmounted(() => obs.disconnect())
})

function scrollToNext() {
  const section = document.querySelector('section')
  const next = section?.nextElementSibling
  next?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="space-y-24">
    <!-- Hero with orbit decorations -->
    <section class="pt-6 md:pt-12 text-center relative overflow-visible min-h-[100dvh] flex flex-col items-center justify-center">
      <!-- orbit rings -->
      <div class="orbit-decor" aria-hidden="true">
        <svg class="orbit-ring orbit-r1" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="180" stroke="var(--color-border)" stroke-width=".5" opacity=".3" />
          <circle cx="200" cy="200" r="180" stroke="url(#orb-grad)" stroke-width="1.5" opacity=".5"
            stroke-dasharray="8 6" />
        </svg>
        <svg class="orbit-ring orbit-r2" viewBox="0 0 300 300" fill="none">
          <circle cx="150" cy="150" r="130" stroke="var(--color-border)" stroke-width=".5" opacity=".2" />
          <circle cx="150" cy="150" r="130" stroke="url(#orb-grad)" stroke-width="1" opacity=".4"
            stroke-dasharray="4 8" />
        </svg>
        <div class="orbit-dot dot-1"></div>
        <div class="orbit-dot dot-2"></div>
        <div class="orbit-dot dot-3"></div>
        <svg width="0" height="0"><defs><linearGradient id="orb-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--color-accent)" /><stop offset="100%" stop-color="var(--color-secondary)" /></linearGradient></defs></svg>
      </div>

      <!-- Hero text -->
      <div ref="heroContent" class="relative z-10 space-y-6 hero-content" :class="{ 'is-visible': heroVisible }">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-[var(--color-border)]" style="color: var(--color-muted)">
          <span class="w-1.5 h-1.5 rounded-full" :style="{ background: 'var(--color-accent)' }"></span>
          Built with Nuxt 3 & Prisma
        </div>

        <!-- Sparkles tagline -->
        <div class="flex items-center justify-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-accent)">
            <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/><path d="M18 14l.5 2L20 18l-2 .5L18 20l-.5-2L16 18l2-.5z"/><path d="M6.5 4l.5 2L8 7.5 6 8l-.5-2L4 6l1.5-1z"/>
          </svg>
          <span class="text-xs font-medium tracking-widest uppercase" style="color: var(--color-accent)">星轨 · Stellara</span>
        </div>

        <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
          <span class="bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-secondary)] to-[var(--color-tertiary)] bg-clip-text text-transparent">
            Stellara
          </span>
          <br />
          <span class="loader-text" style="color: var(--color-foreground)">
            <span v-for="(ch, i) in '星与代码的协奏曲'.split('')" :key="i" class="loader-letter" :style="{ '--i': i }">{{ ch }}</span>
          </span>
        </h1>

        <p class="text-base md:text-lg max-w-md mx-auto" style="color: var(--color-muted)">
          一个关于技术、设计与思考的个人博客
        </p>

        <div class="flex items-center justify-center gap-3 pt-2">
          <NuxtLink to="/blog" class="b6-btn">
            <span class="b6-bg"></span>
            <span class="b6-wrap">
              <span class="b6-outline"></span>
              <span class="b6-content">
                <span class="b6-char"><span>R</span><span>e</span><span>a</span><span>d</span><span> </span><span>t</span><span>h</span><span>e</span><span> </span><span>B</span><span>l</span><span>o</span><span>g</span></span>
              </span>
            </span>
          </NuxtLink>
          <NuxtLink to="/register" class="b6-btn">
            <span class="b6-bg"></span>
            <span class="b6-wrap">
              <span class="b6-outline"></span>
              <span class="b6-content">
                <span class="b6-char"><span>G</span><span>e</span><span>t</span><span> </span><span>S</span><span>t</span><span>a</span><span>r</span><span>t</span><span>e</span><span>d</span></span>
              </span>
            </span>
          </NuxtLink>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="scroll-indicator" @click="scrollToNext">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-muted)">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>

    <!-- Pinned Posts -->
    <section v-if="pinnedPosts.length" class="space-y-6">
      <h2 class="text-sm font-semibold uppercase tracking-widest flex items-center gap-2" style="color: var(--color-muted)">
        <span>📌</span> 置顶推荐
      </h2>
      <div class="grid gap-4 md:grid-cols-3">
        <NuxtLink
          v-for="post in pinnedPosts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="group p-5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all glass-card space-y-2.5 relative overflow-hidden"
        >
          <div class="absolute top-3 right-3 text-sm opacity-40">📌</div>
          <div class="text-xs" style="color: var(--color-muted)">
            {{ new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}
          </div>
          <h3 class="font-semibold group-hover:text-[var(--color-accent)] transition-colors">
            {{ post.title }}
          </h3>
          <p v-if="post.excerpt" class="text-sm leading-relaxed line-clamp-2" style="color: var(--color-muted)">
            {{ post.excerpt }}
          </p>
          <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5">
            <span v-for="tag in post.tags" :key="tag.slug"
              class="px-2 py-0.5 rounded text-xs border border-[var(--color-border)]"
              style="color: var(--color-muted)">
              {{ tag.name }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Featured Post -->
    <section v-if="featured" class="space-y-6">
      <h2 class="text-sm font-semibold uppercase tracking-widest" style="color: var(--color-muted)">Featured</h2>
      <NuxtLink :to="`/blog/${featured.slug}`"
        class="block group p-6 md:p-8 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all glass-card">
        <div class="space-y-4">
          <div class="flex items-center gap-3 text-xs" style="color: var(--color-muted)">
            <span>{{ new Date(featured.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
            <span class="flex items-center gap-1" v-if="featured.tags?.length">
              <span v-for="tag in featured.tags" :key="tag.slug"
                class="px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                {{ tag.name }}
              </span>
            </span>
          </div>
          <h3 class="text-2xl md:text-3xl font-bold group-hover:text-[var(--color-accent)] transition-colors">
            {{ featured.title }}
          </h3>
          <p v-if="featured.excerpt" class="text-sm leading-relaxed" style="color: var(--color-muted)">
            {{ extractExcerpt(featured.content, 240) }}
          </p>
          <span class="inline-flex items-center gap-1 text-sm font-medium transition-colors"
            :style="{ color: 'var(--color-accent)' }">
            Read more
            <span class="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </NuxtLink>
    </section>

    <!-- Recent Posts -->
    <section v-if="rest.length" class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold uppercase tracking-widest" style="color: var(--color-muted)">Latest Posts</h2>
        <NuxtLink to="/blog"
          class="text-xs font-medium transition-colors"
          :style="{ color: 'var(--color-accent)' }">
          View all &rarr;
        </NuxtLink>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <NuxtLink v-for="post in rest" :key="post.id" :to="`/blog/${post.slug}`"
          class="group p-5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/20 transition-all glass-card space-y-2.5">
          <div class="text-xs" style="color: var(--color-muted)">
            {{ new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}
          </div>
          <h3 class="font-semibold group-hover:text-[var(--color-accent)] transition-colors">
            {{ post.title }}
          </h3>
          <p v-if="post.excerpt" class="text-sm leading-relaxed line-clamp-2" style="color: var(--color-muted)">
            {{ post.excerpt }}
          </p>
          <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5">
            <span v-for="tag in post.tags" :key="tag.slug"
              class="px-2 py-0.5 rounded text-xs border border-[var(--color-border)]"
              style="color: var(--color-muted)">
              {{ tag.name }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Topics -->
    <section v-if="tagList.length" class="space-y-6">
      <h2 class="text-sm font-semibold uppercase tracking-widest" style="color: var(--color-muted)">Topics</h2>
      <div class="flex flex-wrap gap-2">
        <NuxtLink v-for="tag in tagList" :key="tag.slug" :to="`/blog?tag=${tag.slug}`"
          class="px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-all hover:border-[var(--color-accent)]"
          :style="{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }">
          {{ tag.name }}
          <span v-if="tag.usageCount" class="ml-1 opacity-60">{{ tag.usageCount }}</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ── Orbit Decorations ── */
.orbit-decor {
  position: absolute; inset: -60% -30%; z-index: 0;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none;
}
.orbit-ring {
  position: absolute; width: 100%; height: 100%;
  animation: orb-spin 30s linear infinite;
  opacity: .5;
}
.orbit-r2 { width: 72%; height: 72%; animation-duration: 20s; animation-direction: reverse; }

.orbit-dot {
  position: absolute; width: 5px; height: 5px; border-radius: 50%;
  background: var(--color-accent); opacity: .6;
}
.dot-1 {
  animation: dot-orbit-1 30s linear infinite;
  box-shadow: 0 0 8px 2px var(--color-accent);
}
.dot-2 {
  animation: dot-orbit-2 20s linear infinite;
  background: var(--color-secondary);
  box-shadow: 0 0 8px 2px var(--color-secondary);
}
.dot-3 {
  width: 3px; height: 3px;
  animation: dot-orbit-1 25s linear infinite reverse;
  background: var(--color-tertiary);
  opacity: .4;
}

@keyframes orb-spin {
  to { transform: rotate(360deg); }
}
@keyframes dot-orbit-1 {
  0% { transform: rotate(0deg) translateX(180px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(180px) rotate(-360deg); }
}
@keyframes dot-orbit-2 {
  0% { transform: rotate(0deg) translateX(115px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(115px) rotate(-360deg); }
}

/* ── 文字彩虹浮现 ── */
.loader-text { display: inline-block; }
.loader-letter {
  display: inline-block;
  opacity: 0;
  animation: emerge 3s ease-out forwards;
  animation-delay: calc(var(--i) * 0.12s + 0.2s);
}
@keyframes emerge {
  0% { opacity: 0; transform: translateY(8px); filter: saturate(0); }
  30% { opacity: 1; transform: translateY(0); filter: saturate(1); }
  to { opacity: 1; transform: translateY(0); filter: saturate(1); }
}

/* ── Hero animation ── */
.hero-content {
  opacity: 0; transform: translateY(30px);
  transition: opacity .8s cubic-bezier(0.22,1,0.36,1), transform .8s cubic-bezier(0.22,1,0.36,1);
}
.hero-content.is-visible { opacity: 1; transform: translateY(0); }

/* ── Scroll indicator ── */
.scroll-indicator {
  position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
  cursor: pointer; opacity: .5; transition: opacity .3s;
  animation: bounce-down 2s ease-in-out infinite;
}
.scroll-indicator:hover { opacity: 1; }
@keyframes bounce-down {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(6px); }
}

/* ── glass card ── */
.glass-card {
  background: color-mix(in srgb, var(--color-surface) 50%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
