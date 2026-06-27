<script setup lang="ts">
const progress = ref(0)
const visible = ref(false)

function onScroll() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
  progress.value = pct
  const article = document.querySelector('article')
  if (article) {
    const rect = article.getBoundingClientRect()
    visible.value = rect.top < window.innerHeight * 0.5
  } else {
    visible.value = false
  }
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})

const size = 48; const stroke = 3
const radius = (size - stroke) / 2
const circumference = computed(() => 2 * Math.PI * radius)
const offset = computed(() => circumference.value - (progress.value / 100) * circumference.value)
</script>

<template>
  <div v-if="visible" class="rp-wrap">
    <div class="rp-bar">
      <div class="rp-fill" :style="{ width: progress + '%' }"></div>
    </div>
    <div class="rp-ring-wrap">
      <svg :width="size" :height="size" class="rp-svg">
        <circle :cx="size/2" :cy="size/2" :r="radius" stroke="rgba(128,128,128,0.1)" :stroke-width="stroke" fill="none" />
        <circle :cx="size/2" :cy="size/2" :r="radius"
          stroke="var(--color-accent)" :stroke-width="stroke" fill="none"
          :stroke-dasharray="circumference" :stroke-dashoffset="offset"
          stroke-linecap="round" class="rp-circle" />
      </svg>
      <span class="rp-pct">{{ Math.round(progress) }}%</span>
    </div>
  </div>
</template>

<style scoped>
.rp-bar {
  position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 1100;
  pointer-events: none; background: transparent;
}
.rp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent), var(--color-secondary), var(--color-tertiary));
  transition: width 80ms linear;
}
.rp-ring-wrap {
  position: fixed; top: 5rem; right: 1rem; z-index: 1100; pointer-events: none;
  display: flex; align-items: center; justify-content: center;
  width: 48px; height: 48px; border-radius: 50%;
  background: color-mix(in srgb, var(--color-surface) 75%, transparent);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid var(--color-border); box-shadow: 0 4px 16px rgba(0,0,0,.12);
}
.rp-svg { position: absolute; inset: 0; transform: rotate(-90deg); }
.rp-circle { transition: stroke-dashoffset 80ms linear; }
.rp-pct { font-size: 10px; font-weight: 700; color: var(--color-foreground); }
</style>
