<script setup lang="ts">
const theme = useTheme()
const isDark = computed(() => ['stellara', 'ocean'].includes(theme.theme.value))
const isReduced = computed(() => ['extreme', 'ultra-low'].includes(theme.perfMode.value))

const orbs = computed(() => {
  if (['extreme', 'ultra-low'].includes(theme.perfMode.value)) return []
  if (theme.perfMode.value === 'performance') {
    return [{ size: 320, top: '16%', left: '8%', dur: 36, delay: 0 }]
  }
  return [
    { size: 460, top: '8%', left: '-4%', dur: 32, delay: 0 },
    { size: 520, top: '44%', left: '64%', dur: 38, delay: 4 },
  ]
})

const starCount = computed(() => isReduced.value ? 0 : theme.perfMode.value === 'performance' ? 15 : 42)
const stars = computed(() =>
  Array.from({ length: starCount.value }).map(() => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }))
)

const petalCount = computed(() => isReduced.value ? 0 : 8)
const petals = computed(() =>
  Array.from({ length: petalCount.value }).map((_, i) => ({
    left: Math.random() * 100,
    size: Math.random() * 10 + 8,
    delay: Math.random() * 12,
    duration: Math.random() * 8 + 10,
    hue: i % 3,
  }))
)
</script>

<template>
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div class="bokeh-layer">
      <div v-for="(o, i) in orbs" :key="i"
        class="bokeh-orb"
        :style="{
          width: o.size + 'px',
          height: o.size + 'px',
          top: o.top,
          left: o.left,
          animation: `drift-slow ${o.dur}s ease-in-out ${o.delay}s infinite`,
        }" />
    </div>

    <!-- petals -->
    <span v-for="(p, i) in petals" :key="'p'+i"
      class="sakura-petal"
      :style="{
        left: p.left + '%',
        width: p.size + 'px',
        height: p.size + 'px',
        background: p.hue === 0 ? 'var(--petal-pink, #ffb7c5)' : p.hue === 1 ? 'var(--petal-white, #fff)' : 'var(--petal-blue, #b3daf5)',
        borderRadius: p.hue === 0 ? '50% 0 50% 50%' : p.hue === 1 ? '50%' : '0 50% 50% 50%',
        animationDuration: p.duration + 's',
        animationDelay: p.delay + 's',
      }" />
  </div>
</template>
