<script setup lang="ts">
const props = defineProps<{ content: string }>()
const activeId = ref('')
const mobileOpen = ref(false)

interface TocItem { id: string; text: string; level: number }

const items = computed<TocItem[]>(() => {
  const lines = props.content.split('\n')
  const result: TocItem[] = []
  let inCode = false
  for (const line of lines) {
    if (line.trim().startsWith('```')) { inCode = !inCode; continue }
    if (inCode) continue
    const m = line.match(/^(#{1,3})\s+(.+)$/)
    if (m) {
      const level = m[1].length
      const text = m[2].trim().replace(/[*_`]/g, '')
      const id = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '')
      if (id) result.push({ id, text, level })
    }
  }
  return result
})

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeId.value = id
    window.history.replaceState(null, '', `#${id}`)
    mobileOpen.value = false
  }
}

onMounted(() => {
  if (!items.value.length) return
  const article = document.querySelector('.markdown-content')
  if (!article) return
  const headers = article.querySelectorAll('h1, h2, h3')
  const idMap: Record<string, HTMLElement> = {}
  headers.forEach(h => {
    const t = h.textContent?.trim() || ''
    const id = t.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '')
    if (id && !h.id) h.id = id
    if (id && h instanceof HTMLElement) idMap[id] = h
  })
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) activeId.value = e.target.id })
  }, { rootMargin: '-80px 0px -70% 0px' })
  Object.values(idMap).forEach(el => obs.observe(el))
  onUnmounted(() => obs.disconnect())
})

watch(() => props.content, () => { activeId.value = ''; mobileOpen.value = false })
</script>

<template>
  <div v-if="items.length">
    <nav class="toc-desktop">
      <div class="toc-box">
        <p class="toc-label">目录</p>
        <ul class="toc-list">
          <li v-for="item in items" :key="item.id"
            :style="{ paddingLeft: (item.level - 1) * 12 + 'px' }">
            <a :href="'#' + item.id" @click.prevent="scrollTo(item.id)"
              :class="['toc-link', { active: activeId === item.id }]">
              {{ item.text }}
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <div class="toc-mobile">
      <button @click="mobileOpen = !mobileOpen" class="toc-mob-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        <span>目录</span>
        <span class="toc-count">({{ items.length }})</span>
      </button>
      <Transition name="toc-m">
        <div v-if="mobileOpen" class="toc-mob-panel">
          <div class="toc-mob-header">
            <span class="toc-label">目录</span>
            <button @click="mobileOpen = false" class="toc-close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <ul class="toc-list">
            <li v-for="item in items" :key="item.id"
              :style="{ paddingLeft: (item.level - 1) * 12 + 'px' }">
              <a :href="'#' + item.id" @click.prevent="scrollTo(item.id)"
                :class="['toc-link', { active: activeId === item.id }]">
                {{ item.text }}
              </a>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.toc-desktop { display: none; }
@media (min-width: 1280px) {
  .toc-desktop {
    display: block; position: fixed; top: 6rem; right: calc(50% - 480px - 220px);
    width: 200px; z-index: 40;
  }
}
.toc-box {
  background: color-mix(in srgb, var(--color-surface) 75%, transparent);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid var(--color-border); border-radius: 12px;
  padding: 1rem; max-height: calc(100vh - 8rem); overflow-y: auto;
}
.toc-label {
  font-size: .6875rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .08em; color: var(--color-accent); margin-bottom: .75rem;
}
.toc-list { list-style: none; margin: 0; padding: 0; }
.toc-link {
  display: block; padding: .25rem 0 .25rem .75rem;
  border-left: 2px solid transparent; font-size: .8125rem;
  color: var(--color-muted); text-decoration: none;
  transition: all .2s;
}
.toc-link:hover { color: var(--color-foreground); border-color: color-mix(in srgb, var(--color-accent) 40%, transparent); }
.toc-link.active { color: var(--color-accent); border-color: var(--color-accent); font-weight: 500; }

.toc-mobile { display: block; }
@media (min-width: 1280px) { .toc-mobile { display: none; } }
.toc-mob-btn {
  position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); z-index: 90;
  display: flex; align-items: center; gap: .375rem;
  padding: .5rem 1rem; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--color-accent) 20%, transparent);
  background: color-mix(in srgb, var(--color-surface) 85%, transparent);
  backdrop-filter: blur(16px) saturate(180%);
  color: var(--color-muted); font-size: .8125rem; font-weight: 500; cursor: pointer;
  transition: all .2s; box-shadow: 0 4px 20px rgba(0,0,0,.12);
}
.toc-mob-btn:hover { color: var(--color-accent); }
.toc-count { font-size: .6875rem; color: color-mix(in srgb, var(--color-muted) 60%, transparent); }
.toc-mob-panel {
  position: fixed; left: .75rem; right: .75rem; bottom: 4.5rem; z-index: 90;
  background: color-mix(in srgb, var(--color-surface) 85%, transparent);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--color-border); border-radius: 16px;
  padding: 1rem; max-height: 40vh; overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0,0,0,.15);
}
.toc-mob-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: .75rem;
}
.toc-close {
  border: none; background: transparent; color: var(--color-muted); cursor: pointer; padding: 2px;
}
.toc-close:hover { color: var(--color-foreground); }

.toc-m-enter-active, .toc-m-leave-active { transition: all .2s ease; }
.toc-m-enter-from, .toc-m-leave-to { opacity: 0; transform: translateY(8px); }
</style>
