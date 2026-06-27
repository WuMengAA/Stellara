const THEMES = ['dawn', 'stellara', 'sakura', 'mint', 'ocean'] as const
export type Theme = typeof THEMES[number]

const PERF_MODES = ['quality', 'balanced', 'performance', 'extreme', 'ultra-low'] as const
export type PerfMode = typeof PERF_MODES[number]

const GLOBAL_STYLES = ['glass', 'minimal', 'neon', 'spotlight', 'solid'] as const
export type GlobalStyle = typeof GLOBAL_STYLES[number]

const DISPLAY_MODES = ['scroll', 'grid'] as const
export type DisplayMode = typeof DISPLAY_MODES[number]

const MODES = ['light', 'dark'] as const
export type ColorMode = typeof MODES[number]

// 各主题默认的 color mode
const DEFAULT_MODE: Record<Theme, ColorMode> = {
  dawn: 'light',
  stellara: 'dark',
  sakura: 'light',
  mint: 'light',
  ocean: 'light',
}

export function useTheme() {
  const theme = ref<Theme>('stellara')
  const mode = ref<ColorMode>('dark')
  const perfMode = ref<PerfMode>('balanced')

  // 特效参数
  const blurAmount = ref(12)
  const glowIntensity = ref(1)
  const animationSpeed = ref(1)
  const fontScale = ref(1)
  const starDensity = ref(1)

  // 开关
  const bokehVisible = ref(true)
  const auraVisible = ref(true)

  // 布局
  const compactMode = ref(false)
  const globalStyle = ref<GlobalStyle>('glass')
  const displayMode = ref<DisplayMode>('scroll')

  function syncAttr(key: string, value: string) {
    if (import.meta.client) document.documentElement.setAttribute(key, value)
  }
  function removeAttr(key: string) {
    if (import.meta.client) document.documentElement.removeAttribute(key)
  }

  function applyTheme(t: Theme) {
    theme.value = t
    syncAttr('data-theme', t)
    // 切主题时，保持当前 mode，但如果 mode 与主题默认一致，重置显式标记
    const def = DEFAULT_MODE[t]
    if (mode.value === def) {
      removeAttr('data-mode')
    } else {
      syncAttr('data-mode', mode.value)
    }
    save()
  }

  function applyMode(m: ColorMode) {
    mode.value = m
    const def = DEFAULT_MODE[theme.value]
    if (m === def) {
      removeAttr('data-mode')
    } else {
      syncAttr('data-mode', m)
    }
    save()
  }

  function toggleMode() {
    applyMode(mode.value === 'light' ? 'dark' : 'light')
  }

  function applyPerf(m: PerfMode) {
    perfMode.value = m
    syncAttr('data-performance', m)
    save()
  }

  function applyBlur(v: number) {
    blurAmount.value = v
    syncAttr('data-blur', String(v))
    save()
  }

  function applyGlow(v: number) {
    glowIntensity.value = v
    syncAttr('data-glow', String(Math.round(v * 10)))
    save()
  }

  function applyAnimSpeed(v: number) {
    animationSpeed.value = v
    syncAttr('data-anim-speed', String(Math.round(v * 10)))
    save()
  }

  function applyFontScale(v: number) {
    fontScale.value = v
    syncAttr('data-font-scale', String(Math.round(v * 100)))
    save()
  }

  function applyStarDensity(v: number) {
    starDensity.value = v
    syncAttr('data-star-density', String(Math.round(v * 10)))
    save()
  }

  function toggleBokeh(v: boolean) {
    bokehVisible.value = v
    syncAttr('data-bokeh', v ? '' : 'hidden')
    if (!v) removeAttr('data-bokeh')
    save()
  }

  function toggleAura(v: boolean) {
    auraVisible.value = v
    syncAttr('data-aura', v ? '' : 'hidden')
    if (!v) removeAttr('data-aura')
    save()
  }

  function applyCompact(v: boolean) {
    compactMode.value = v
    syncAttr('data-compact', v ? 'true' : '')
    if (!v) removeAttr('data-compact')
    save()
  }

  function applyGlobalStyle(s: GlobalStyle) {
    globalStyle.value = s
    syncAttr('data-style', s)
    save()
  }

  function applyDisplayMode(m: DisplayMode) {
    displayMode.value = m
    syncAttr('data-display', m)
    save()
  }

  const storageKey = 'stellara-prefs-v2'

  function save() {
    if (!import.meta.client) return
    const data = {
      theme: theme.value,
      mode: mode.value,
      perf: perfMode.value,
      blur: blurAmount.value,
      glow: glowIntensity.value,
      animSpeed: animationSpeed.value,
      fontScale: fontScale.value,
      starDensity: starDensity.value,
      bokeh: bokehVisible.value,
      aura: auraVisible.value,
      compact: compactMode.value,
      style: globalStyle.value,
      display: displayMode.value,
    }
    try { localStorage.setItem(storageKey, JSON.stringify(data)) } catch {}
  }

  function loadPrefs() {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const d = JSON.parse(raw)
        if (d.theme && THEMES.includes(d.theme)) applyTheme(d.theme)
        if (d.mode && MODES.includes(d.mode)) applyMode(d.mode)
        if (d.perf && PERF_MODES.includes(d.perf)) applyPerf(d.perf)
        if (typeof d.blur === 'number') applyBlur(d.blur)
        if (typeof d.glow === 'number') applyGlow(d.glow)
        if (typeof d.animSpeed === 'number') applyAnimSpeed(d.animSpeed)
        if (typeof d.fontScale === 'number') applyFontScale(d.fontScale)
        if (typeof d.starDensity === 'number') applyStarDensity(d.starDensity)
        if (typeof d.bokeh === 'boolean') toggleBokeh(d.bokeh)
        if (typeof d.aura === 'boolean') toggleAura(d.aura)
        if (typeof d.compact === 'boolean') applyCompact(d.compact)
        if (d.style && GLOBAL_STYLES.includes(d.style)) applyGlobalStyle(d.style)
        if (d.display && DISPLAY_MODES.includes(d.display)) applyDisplayMode(d.display)
        return
      }
    } catch {}
    // fallback: 老版本单值存储
    const savedTheme = localStorage.getItem('stellara-theme') as Theme | null
    if (savedTheme && THEMES.includes(savedTheme)) applyTheme(savedTheme)
    else applyTheme('stellara')

    const perf = localStorage.getItem('stellara-perf') as PerfMode | null
    if (perf && PERF_MODES.includes(perf)) applyPerf(perf)
    else applyPerf('balanced')
  }

  return {
    theme: readonly(theme),
    mode: readonly(mode),
    perfMode: readonly(perfMode),
    blurAmount: readonly(blurAmount),
    glowIntensity: readonly(glowIntensity),
    animationSpeed: readonly(animationSpeed),
    fontScale: readonly(fontScale),
    starDensity: readonly(starDensity),
    bokehVisible: readonly(bokehVisible),
    auraVisible: readonly(auraVisible),
    compactMode: readonly(compactMode),
    globalStyle: readonly(globalStyle),
    displayMode: readonly(displayMode),
    themes: THEMES,
    perfModes: PERF_MODES,
    globalStyles: GLOBAL_STYLES,
    displayModes: DISPLAY_MODES,
    applyTheme,
    applyMode,
    toggleMode,
    applyPerf,
    applyBlur,
    applyGlow,
    applyAnimSpeed,
    applyFontScale,
    applyStarDensity,
    toggleBokeh,
    toggleAura,
    applyCompact,
    applyGlobalStyle,
    applyDisplayMode,
    loadPrefs,
  }
}
