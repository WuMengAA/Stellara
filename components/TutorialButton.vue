<script setup lang="ts">
const open = ref(false)
const panel = ref<HTMLElement>()
function toggle() { open.value = !open.value }

onMounted(() => {
  function handleClick(e: MouseEvent) {
    if (panel.value && !panel.value.contains(e.target as Node)) open.value = false
  }
  document.addEventListener('mousedown', handleClick)
  onUnmounted(() => document.removeEventListener('mousedown', handleClick))
})

const links = [
  { label: 'Browse Blog', to: '/blog' },
  { label: 'API', to: '/api' },
  { label: 'About', to: '/about' },
  { label: 'Archive', to: '/archive' },
]
</script>

<template>
  <div ref="panel" class="tb-wrap">
    <button class="tb-btn" title="教程" @click="toggle">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-accent)">
        <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/><path d="M18 14l.5 2L20 18l-2 .5L18 20l-.5-2L16 18l2-.5z"/><path d="M6.5 4l.5 2L8 7.5 6 8l-.5-2L4 6l1.5-1z"/>
      </svg>
    </button>

    <Transition name="tb">
      <div v-if="open" class="tb-panel">
        <div class="tb-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-accent)">
            <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/><path d="M18 14l.5 2L20 18l-2 .5L18 20l-.5-2L16 18l2-.5z"/><path d="M6.5 4l.5 2L8 7.5 6 8l-.5-2L4 6l1.5-1z"/>
          </svg>
          <span>Quick Navigation</span>
        </div>
        <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="tb-link" @click="open = false">
          {{ link.label }}
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tb-wrap { position: fixed; bottom: 5rem; left: 1.25rem; z-index: 101; }
@media (min-width: 768px) { .tb-wrap { bottom: 2rem; } }

.tb-btn {
  width: 40px; height: 40px; border-radius: 50%; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,.12);
  background: color-mix(in srgb, var(--color-accent) 15%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
  transition: background .2s, transform .2s;
}
.tb-btn:hover { transform: scale(1.08); background: color-mix(in srgb, var(--color-accent) 25%, transparent); }

.tb-panel {
  position: absolute; bottom: calc(100% + 12px); left: 0;
  width: 180px; padding: 6px; border-radius: 14px;
  background: color-mix(in srgb, var(--color-panel) 92%, transparent);
  backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid var(--color-border-strong);
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
}

.tb-header {
  display: flex; align-items: center; gap: .5rem;
  padding: .5rem .75rem; margin-bottom: 2px;
  font-size: .75rem; font-weight: 600; letter-spacing: .02em;
  color: var(--color-muted);
}

.tb-link {
  display: block; padding: .375rem .75rem; border-radius: 8px;
  font-size: .8125rem; color: var(--color-muted); text-decoration: none;
  transition: background .15s;
}
.tb-link:hover { background: color-mix(in srgb, var(--color-accent) 10%, transparent); color: var(--color-foreground); }

.tb-enter-active, .tb-leave-active { transition: all .2s ease; }
.tb-enter-from, .tb-leave-to { opacity: 0; transform: translateY(6px); }
</style>
