<script setup lang="ts">
const theme = useTheme()
const auth = useAuthStore()

const themes = [
  { id: 'dawn' as const, label: 'Dawn', emoji: '☀', desc: '暖色晨曦，柔和明亮' },
  { id: 'stellara' as const, label: 'Stellara', emoji: '✦', desc: '星空暗色，深邃沉浸' },
  { id: 'sakura' as const, label: 'Sakura', emoji: '🌸', desc: '樱花粉调，温柔治愈' },
  { id: 'mint' as const, label: 'Mint', emoji: '🌿', desc: '薄荷清新，自然舒爽' },
  { id: 'ocean' as const, label: 'Ocean', emoji: '🌊', desc: '海洋深蓝，沉静专注' },
]
const perfModes = [
  { id: 'quality' as const, label: '画质优先', desc: '全特效开启，视觉最佳', icon: '🌈' },
  { id: 'balanced' as const, label: '均衡模式', desc: '平衡性能与视觉效果', icon: '⚖️' },
  { id: 'performance' as const, label: '性能优先', desc: '降低部分动效，提升流畅度', icon: '⚡' },
  { id: 'extreme' as const, label: '极限模式', desc: '极致流畅，适合低配设备', icon: '🔥' },
  { id: 'ultra-low' as const, label: '省电模式', desc: '关闭所有动效，最省电', icon: '🔋' },
]
const globalStyles = [
  { id: 'glass' as const, label: 'Glass', desc: '玻璃拟态，立体通透' },
  { id: 'minimal' as const, label: 'Minimal', desc: '极简干净，无多余装饰' },
  { id: 'neon' as const, label: 'Neon', desc: '霓虹发光，赛博气息' },
  { id: 'spotlight' as const, label: 'Spotlight', desc: '聚光灯效果，聚焦主体' },
  { id: 'solid' as const, label: 'Solid', desc: '纯色实心，清晰稳重' },
]

const activeTab = ref<'theme' | 'effects' | 'layout' | 'performance'>('theme')
const tabs = [
  { id: 'theme' as const, label: '主题' },
  { id: 'effects' as const, label: '特效' },
  { id: 'layout' as const, label: '布局' },
  { id: 'performance' as const, label: '性能' },
]
</script>

<template>
  <div class="max-w-lg mx-auto space-y-8 pb-16">
    <div class="flex items-center justify-between mb-2">
      <div>
        <h1 class="text-xl font-bold">个性化设置</h1>
        <p class="text-xs mt-0.5" style="color: var(--color-muted)">主题、特效、布局与性能偏好</p>
      </div>
      <NuxtLink to="/profile/edit" class="text-xs" style="color: var(--color-muted)">编辑资料</NuxtLink>
    </div>

    <!-- Tab nav -->
    <div class="flex gap-1 p-1 rounded-xl" style="background: color-mix(in srgb, var(--color-surface-2) 50%, transparent); border: 1px solid var(--color-border)">
      <button v-for="tab in tabs" :key="tab.id"
        @click="activeTab = tab.id"
        class="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
        :class="activeTab === tab.id ? 'bg-[var(--color-accent)] text-white shadow-sm' : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'">
        {{ tab.label }}
      </button>
    </div>

    <!-- === Tab: Theme === -->
    <section v-show="activeTab === 'theme'" class="space-y-6">
      <!-- 主题预设 -->
      <div>
        <h2 class="pz-h">主题预设</h2>
        <p class="text-[.625rem] mb-3" style="color: var(--color-muted)">选择整体视觉风格，影响全局配色与氛围</p>
        <div class="grid grid-cols-1 gap-2">
          <button v-for="t in themes" :key="t.id"
            @click="theme.applyTheme(t.id)"
            class="pz-card" :class="{ active: theme.theme.value === t.id }">
            <div class="flex items-center gap-3">
              <span class="text-xl">{{ t.emoji }}</span>
              <div class="flex-1 text-left">
                <p class="text-sm font-semibold">{{ t.label }}</p>
                <p class="text-[.625rem]" style="color: var(--color-muted)">{{ t.desc }}</p>
              </div>
            </div>
            <span v-if="theme.theme.value === t.id" class="text-xs" style="color: var(--color-accent)">使用中</span>
          </button>
        </div>
      </div>

      <!-- 深浅模式 -->
      <div>
        <h2 class="pz-h">深浅模式</h2>
        <p class="text-[.625rem] mb-3" style="color: var(--color-muted)">当前主题的明暗变体</p>
        <div class="flex gap-2">
          <button @click="theme.applyMode('light')"
            class="pz-card flex-1" :class="{ active: theme.mode.value === 'light' }">
            <span class="text-lg">☀️</span>
            <span class="text-sm font-medium">浅色</span>
            <span v-if="theme.mode.value === 'light'" class="text-xs" style="color: var(--color-accent)">✓</span>
          </button>
          <button @click="theme.applyMode('dark')"
            class="pz-card flex-1" :class="{ active: theme.mode.value === 'dark' }">
            <span class="text-lg">🌙</span>
            <span class="text-sm font-medium">深色</span>
            <span v-if="theme.mode.value === 'dark'" class="text-xs" style="color: var(--color-accent)">✓</span>
          </button>
        </div>
      </div>

      <!-- 全局风格 -->
      <div>
        <h2 class="pz-h">全局风格</h2>
        <p class="text-[.625rem] mb-3" style="color: var(--color-muted)">界面渲染风格</p>
        <div class="flex flex-wrap gap-1.5">
          <button v-for="s in globalStyles" :key="s.id"
            @click="theme.applyGlobalStyle(s.id)"
            class="pz-chip" :class="{ active: theme.globalStyle.value === s.id }">
            {{ s.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- === Tab: Effects === -->
    <section v-show="activeTab === 'effects'" class="space-y-6">
      <!-- 模糊强度 -->
      <div>
        <h2 class="pz-h">毛玻璃模糊</h2>
        <p class="text-[.625rem] mb-1" style="color: var(--color-muted)">全局毛玻璃背景的模糊程度</p>
        <div class="flex items-center gap-3">
          <input type="range" min="2" max="20" step="2"
            :value="theme.blurAmount.value"
            @input="theme.applyBlur(Number(($event.target as HTMLInputElement).value))"
            class="pz-slider flex-1" />
          <span class="text-xs font-mono w-6 text-right" style="color: var(--color-muted)">{{ theme.blurAmount.value }}px</span>
        </div>
      </div>

      <!-- 发光强度 -->
      <div>
        <h2 class="pz-h">发光强度</h2>
        <p class="text-[.625rem] mb-1" style="color: var(--color-muted)">强调色发光的倍率</p>
        <div class="flex items-center gap-3">
          <input type="range" min="0.5" max="2" step="0.1"
            :value="theme.glowIntensity.value"
            @input="theme.applyGlow(Number(($event.target as HTMLInputElement).value))"
            class="pz-slider flex-1" />
          <span class="text-xs font-mono w-6 text-right" style="color: var(--color-muted)">{{ theme.glowIntensity.value }}×</span>
        </div>
      </div>

      <!-- 动画速度 -->
      <div>
        <h2 class="pz-h">动画速度</h2>
        <p class="text-[.625rem] mb-1" style="color: var(--color-muted)">页面动效的播放速度</p>
        <div class="flex items-center gap-3">
          <input type="range" min="0.5" max="2" step="0.1"
            :value="theme.animationSpeed.value"
            @input="theme.applyAnimSpeed(Number(($event.target as HTMLInputElement).value))"
            class="pz-slider flex-1" />
          <span class="text-xs font-mono w-6 text-right" style="color: var(--color-muted)">{{ theme.animationSpeed.value }}×</span>
        </div>
      </div>

      <!-- 星空密度 -->
      <div>
        <h2 class="pz-h">星空密度</h2>
        <p class="text-[.625rem] mb-1" style="color: var(--color-muted)">星空背景的密集程度</p>
        <div class="flex items-center gap-3">
          <input type="range" min="0.5" max="2" step="0.1"
            :value="theme.starDensity.value"
            @input="theme.applyStarDensity(Number(($event.target as HTMLInputElement).value))"
            class="pz-slider flex-1" />
          <span class="text-xs font-mono w-6 text-right" style="color: var(--color-muted)">{{ theme.starDensity.value }}×</span>
        </div>
      </div>

      <!-- 效果开关 -->
      <div>
        <h2 class="pz-h">视觉特效</h2>
        <p class="text-[.625rem] mb-3" style="color: var(--color-muted)">独立开关背景特效层</p>
        <div class="space-y-2">
          <label class="flex items-center justify-between pz-card cursor-pointer">
            <span class="text-sm">Bokeh 光斑</span>
            <input type="checkbox" :checked="theme.bokehVisible.value"
              @change="theme.toggleBokeh(($event.target as HTMLInputElement).checked)"
              class="pz-toggle" />
          </label>
          <label class="flex items-center justify-between pz-card cursor-pointer">
            <span class="text-sm">Aura 光晕</span>
            <input type="checkbox" :checked="theme.auraVisible.value"
              @change="theme.toggleAura(($event.target as HTMLInputElement).checked)"
              class="pz-toggle" />
          </label>
        </div>
      </div>
    </section>

    <!-- === Tab: Layout === -->
    <section v-show="activeTab === 'layout'" class="space-y-6">
      <!-- 字体缩放 -->
      <div>
        <h2 class="pz-h">字体缩放</h2>
        <p class="text-[.625rem] mb-1" style="color: var(--color-muted)">全局字号倍率</p>
        <div class="flex items-center gap-3">
          <input type="range" min="0.8" max="1.2" step="0.05"
            :value="theme.fontScale.value"
            @input="theme.applyFontScale(Number(($event.target as HTMLInputElement).value))"
            class="pz-slider flex-1" />
          <span class="text-xs font-mono w-10 text-right" style="color: var(--color-muted)">{{ Math.round(theme.fontScale.value * 100) }}%</span>
        </div>
      </div>

      <!-- 紧凑模式 -->
      <div>
        <h2 class="pz-h">紧凑模式</h2>
        <p class="text-[.625rem] mb-3" style="color: var(--color-muted)">压缩间距，显示更多内容</p>
        <label class="flex items-center justify-between pz-card cursor-pointer">
          <span class="text-sm">启用紧凑布局</span>
          <input type="checkbox" :checked="theme.compactMode.value"
            @change="theme.applyCompact(($event.target as HTMLInputElement).checked)"
            class="pz-toggle" />
        </label>
      </div>
    </section>

    <!-- === Tab: Performance === -->
    <section v-show="activeTab === 'performance'" class="space-y-6">
      <div>
        <h2 class="pz-h">性能模式</h2>
        <p class="text-[.625rem] mb-3" style="color: var(--color-muted)">控制特效负载，按设备能力自由调节</p>
        <div class="grid grid-cols-1 gap-2">
          <button v-for="m in perfModes" :key="m.id"
            @click="theme.applyPerf(m.id)"
            class="pz-card" :class="{ active: theme.perfMode.value === m.id }">
            <div class="flex items-center gap-3">
              <span class="text-lg">{{ m.icon }}</span>
              <div class="flex-1 text-left">
                <p class="text-sm font-semibold">{{ m.label }}</p>
                <p class="text-[.625rem]" style="color: var(--color-muted)">{{ m.desc }}</p>
              </div>
            </div>
            <span v-if="theme.perfMode.value === m.id" class="text-xs" style="color: var(--color-accent)">使用中</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Preview -->
    <section class="pz-card pz-preview">
      <p class="text-xs font-semibold mb-2">当前组合</p>
      <div class="flex items-center gap-2 text-sm flex-wrap">
        <span>{{ themes.find(t => t.id === theme.theme.value)?.emoji }} {{ theme.theme.value }}</span>
        <span class="text-[.625rem]" style="color: var(--color-muted)">{{ theme.mode.value === 'dark' ? '🌙' : '☀️' }}{{ theme.mode.value }}</span>
        <span style="color: var(--color-muted)">·</span>
        <span>{{ perfModes.find(m => m.id === theme.perfMode.value)?.icon }} {{ perfModes.find(m => m.id === theme.perfMode.value)?.label }}</span>
        <span style="color: var(--color-muted)">·</span>
        <span class="text-[.625rem]" style="color: var(--color-muted)">{{ Math.round(theme.fontScale.value * 100) }}%</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.pz-h { font-size: .6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--color-muted); margin-bottom: .25rem; }
.pz-card {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding: .75rem 1rem; border-radius: 12px;
  border: 1px solid var(--color-border); cursor: pointer;
  background: color-mix(in srgb, var(--color-surface) 40%, transparent);
  backdrop-filter: blur(8px);
  transition: border-color .2s, background .2s;
  text-align: left; font-family: inherit; gap: .75rem;
}
.pz-card:hover { border-color: color-mix(in srgb, var(--color-accent) 50%, var(--color-border)); }
.pz-card.active { border-color: var(--color-accent); background: color-mix(in srgb, var(--color-accent) 8%, transparent); }
.pz-preview {
  background: color-mix(in srgb, var(--color-accent) 6%, transparent);
  border-color: color-mix(in srgb, var(--color-accent) 30%, transparent);
}
.pz-chip {
  padding: .375rem .875rem; border-radius: 999px;
  border: 1px solid var(--color-border);
  font-size: .75rem; font-weight: 500;
  background: color-mix(in srgb, var(--color-surface) 30%, transparent);
  cursor: pointer; transition: border-color .2s, background .2s;
  color: var(--color-muted); font-family: inherit;
}
.pz-chip:hover { border-color: color-mix(in srgb, var(--color-accent) 50%, var(--color-border)); color: var(--color-foreground); }
.pz-chip.active { border-color: var(--color-accent); background: color-mix(in srgb, var(--color-accent) 10%, transparent); color: var(--color-accent); }

.pz-slider {
  -webkit-appearance: none; appearance: none; height: 4px; border-radius: 2px;
  background: color-mix(in srgb, var(--color-border) 60%, transparent);
  outline: none; cursor: pointer;
}
.pz-slider::-webkit-slider-thumb {
  -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%;
  background: var(--color-accent); border: 2px solid var(--color-panel);
  box-shadow: 0 1px 4px rgba(0,0,0,.15); cursor: pointer;
}
.pz-slider::-moz-range-thumb {
  width: 16px; height: 16px; border-radius: 50%;
  background: var(--color-accent); border: 2px solid var(--color-panel);
  box-shadow: 0 1px 4px rgba(0,0,0,.15); cursor: pointer;
}

.pz-toggle {
  -webkit-appearance: none; appearance: none;
  width: 36px; height: 20px; border-radius: 10px;
  background: color-mix(in srgb, var(--color-surface-2) 60%, transparent);
  border: 1px solid var(--color-border); position: relative; cursor: pointer;
  transition: background .2s, border-color .2s; flex-shrink: 0;
}
.pz-toggle::after {
  content: ''; position: absolute; top: 2px; left: 2px;
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--color-muted); transition: transform .2s, background .2s;
}
.pz-toggle:checked {
  background: color-mix(in srgb, var(--color-accent) 25%, transparent);
  border-color: var(--color-accent);
}
.pz-toggle:checked::after {
  transform: translateX(16px); background: var(--color-accent);
}
</style>
