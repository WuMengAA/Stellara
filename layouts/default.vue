<script setup lang="ts">
const theme = useTheme()
const auth = useAuthStore()
const mounted = ref(false)

onMounted(() => {
  theme.loadPrefs()
  auth.loadFromStorage()
  nextTick(() => { mounted.value = true })
})

const route = useRoute()
const mobileMenuOpen = ref(false)
watch(() => route.path, () => { mobileMenuOpen.value = false })

const isDark = computed(() => theme.mode.value === 'dark')
const themeNames: Record<string, string> = { dawn: 'Dawn', stellara: 'Stellara', sakura: 'Sakura', mint: 'Mint', ocean: 'Ocean' }

const navLinks = [
  { label: '文档', to: '/docs' },
  { label: 'Blog', to: '/blog' },
  { label: 'Tags', to: '/tags' },
  { label: 'VoiceHub', to: 'https://1music.245959623.xyz', external: true },
  { label: 'Archive', to: '/archive' },
]

const moreLinks = [
  { label: 'About', to: '/about' },
  { label: 'API', to: '/api' },
]

const searchOpen = ref(false)
const searchQuery = ref('')
function doSearch() {
  if (searchQuery.value.trim()) {
    navigateTo(`/blog?q=${encodeURIComponent(searchQuery.value.trim())}`)
    searchOpen.value = false
    searchQuery.value = ''
  }
}
</script>

<template>
  <div class="app-shell" :class="mounted ? [`theme-${theme.theme.value}`, `perf-${theme.perfMode.value}`] : 'theme-stellara perf-balanced'">
    <BackgroundEffects />
    <div class="aurora-layer"></div>

    <nav class="navbar navbar-glass">
      <div class="navbar-inner">
        <!-- Logo -->
        <NuxtLink to="/" class="logo">
          <span class="logo-icon stellara-glow">
            <svg width="14" height="14" class="sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/><path d="M18 14l.5 2L20 18l-2 .5L18 20l-.5-2L16 18l2-.5z"/><path d="M6.5 4l.5 2L8 7.5 6 8l-.5-2L4 6l1.5-1z"/>
            </svg>
            <svg width="17" height="17" class="hidden sm-inline-flex" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/><path d="M18 14l.5 2L20 18l-2 .5L18 20l-.5-2L16 18l2-.5z"/><path d="M6.5 4l.5 2L8 7.5 6 8l-.5-2L4 6l1.5-1z"/>
            </svg>
          </span>
          <span class="logo-text">星轨<span class="logo-dot">·</span><span class="logo-sub">Stellara</span></span>
        </NuxtLink>

        <!-- Nav Center -->
        <div class="nav-center">
          <template v-for="link in navLinks" :key="link.to">
            <a v-if="link.external" :href="link.to" target="_blank" rel="noopener noreferrer" class="nav-link">{{ link.label }} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline;vertical-align:middle;margin-left:1px;opacity:.5"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg></a>
            <NuxtLink v-else :to="link.to" class="nav-link" :class="{ active: route.path.startsWith(link.to) }">{{ link.label }}</NuxtLink>
          </template>

          <!-- More dropdown -->
          <div class="more-wrap">
            <button class="nav-link more-trigger">
              更多
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="more-chevron">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div class="more-dropdown">
              <NuxtLink v-for="link in moreLinks" :key="link.to" :to="link.to"
                class="more-item">
                {{ link.label }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Right Actions -->
        <div class="nav-actions">
          <!-- Notifications -->
          <NotificationBell />

          <!-- Search -->
          <button @click="searchOpen = true" class="action-btn" title="Search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          <!-- Theme Toggle -->
          <label class="ts-toggle" :title="isDark ? 'Switch to light' : 'Switch to dark'">
            <input type="checkbox" class="ts-checkbox" :checked="isDark" @change="theme.toggleMode()" />
            <div class="ts-container">
              <div class="ts-circle">
                <div class="ts-sun-moon">
                  <div class="ts-moon"><span class="ts-spot"></span><span class="ts-spot"></span><span class="ts-spot"></span></div>
                </div>
                <div class="ts-clouds"></div>
                <svg class="ts-stars" viewBox="0 0 44 28" fill="none">
                  <path d="M22 4l1.5 3 3 1-3 1.5L22 12l-1.5-3-3-1 3-1L22 4zM7 0l.8 1.5L9.5 2 7.8 3 7 4.5 6.2 3 4.5 2l1.7-.5L7 0zm28 4l.6 1.2L37 6l-1.4.8L35 8l-.6-1.2L33 6l1.4-.8L35 4zm-6 18l.8 1.5L31 25l-2.2 1.5L28 28l-1.5-2L24 25l2.2-.5L28 22zm-16-4l.4.8.8.2-.8.6.2.8-.6-.4-.6.4.2-.8-.8-.6.8-.2.4-.8z" fill="currentColor"/>
                </svg>
              </div>
            </div>
          </label>

          <!-- 个性化设置 -->
          <NuxtLink to="/personalize" class="action-btn" title="个性化设置">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
            </svg>
          </NuxtLink>

          <!-- Auth -->
          <template v-if="!auth.isLoggedIn">
            <NuxtLink to="/login" class="nav-link">Sign In</NuxtLink>
            <NuxtLink to="/register" class="b6-btn">
              <span class="b6-bg"></span>
              <span class="b6-wrap"><span class="b6-outline"></span><span class="b6-content"><span class="b6-char"><span>G</span><span>e</span><span>t</span><span> </span><span>S</span><span>t</span><span>a</span><span>r</span><span>t</span><span>e</span><span>d</span></span></span></span>
            </NuxtLink>
          </template>
          <ProfileDropdown v-else />

          <!-- Hamburger -->
          <button class="hamburger" @click="mobileMenuOpen = !mobileMenuOpen">
            <svg v-if="!mobileMenuOpen" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition name="mobile">
        <div v-if="mobileMenuOpen" class="mobile-menu">
          <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to" class="mobile-link">{{ link.label }}</NuxtLink>
          <NuxtLink v-for="link in moreLinks" :key="link.to" :to="link.to" class="mobile-link">{{ link.label }}</NuxtLink>
          <div class="mobile-section">
            <p class="mobile-label">Theme</p>
            <div class="mobile-themes">
              <button v-for="(name, key) in themeNames" :key="key" @click="theme.applyTheme(key)"
                :class="theme.theme.value === key ? 'active' : ''">
                {{ { dawn: '☀', stellara: '✦', sakura: '🌸', mint: '🌿', ocean: '🌊' }[key] }} {{ name }}
              </button>
            </div>
          </div>
          <template v-if="!auth.isLoggedIn">
            <NuxtLink to="/login" class="mobile-link">Sign In</NuxtLink>
            <NuxtLink to="/register" class="b6-btn mt-2" style="display:block;text-align:center;width:auto"><span class="b6-bg"></span><span class="b6-wrap"><span class="b6-outline"></span><span class="b6-content" style="font-size:14px">Get Started</span></span></NuxtLink>
          </template>
          <template v-else>
            <NuxtLink :to="`/profile/${auth.user.id}`" class="mobile-link">我的主页</NuxtLink>
            <NuxtLink v-if="auth.isAdmin" to="/admin" class="mobile-link">Dashboard</NuxtLink>
            <button @click="auth.logout()" class="mobile-link" style="color:#ef4444">Sign out</button>
          </template>
        </div>
      </Transition>
    </nav>

    <!-- Global Search Overlay -->
    <Transition name="mn-srch">
      <div v-if="searchOpen" class="srch-overlay" @click.self="searchOpen = false">
        <form @submit.prevent="doSearch" class="srch-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input v-model="searchQuery" ref="searchInput" placeholder="搜索文章…" class="srch-input" @keydown.esc="searchOpen = false" />
        </form>
      </div>
    </Transition>

    <main class="main-content">
      <slot />
    </main>

    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] flex items-center justify-center text-white text-sm font-bold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </span>
            <span class="font-bold text-sm">Stellara</span>
          </div>
          <p class="text-xs leading-relaxed" style="color: var(--color-muted)">星与代码的协奏曲。记录技术、设计与思考。</p>
          <p class="text-xs mt-2" style="color: var(--color-muted)">
            &copy; {{ new Date().getFullYear() }} Stellara
          </p>
        </div>

        <div class="footer-col">
          <h4 class="footer-h">导航</h4>
          <ul class="footer-links">
            <li><NuxtLink to="/">首页</NuxtLink></li>
            <li><NuxtLink to="/blog">博客</NuxtLink></li>
            <li><NuxtLink to="/about">关于</NuxtLink></li>
            <li><NuxtLink to="/api">API</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-h">社交</h4>
          <ul class="footer-links">
            <li><a href="#" target="_blank" rel="noopener">GitHub</a></li>
            <li><a href="#" target="_blank" rel="noopener">Twitter / X</a></li>
            <li><a href="#" target="_blank" rel="noopener">掘金</a></li>
            <li><a href="#" target="_blank" rel="noopener">RSS</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-h">技术栈</h4>
          <div class="flex flex-wrap gap-1.5 mt-2">
            <span class="footer-tag">Nuxt 3</span>
            <span class="footer-tag">Vue 3</span>
            <span class="footer-tag">Prisma</span>
            <span class="footer-tag">SQLite</span>
            <span class="footer-tag">Vite</span>
            <span class="footer-tag">Tailwind</span>
          </div>
        </div>
      </div>
    </footer>

    <TutorialButton />
    <MobileNav />
  </div>
</template>

<style>
.app-shell { position: relative; z-index: 1; min-height: 100vh; background: transparent; color: var(--color-foreground); }

.main-content {
  position: relative; z-index: 1; max-width: 960px;
  margin: 0 auto; padding: 6rem 1.25rem 4rem;
}


/* ── Navbar ── */
.navbar {
  position: fixed; top: 1.25rem; left: 50%; transform: translateX(-50%);
  z-index: 1000; width: calc(100% - 2.5rem); max-width: 960px;
  background: color-mix(in srgb, var(--color-surface) 85%, transparent);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  box-shadow: 0 4px 24px rgba(0,0,0,.08);
  transition: background .3s, box-shadow .3s;
}
.navbar-inner {
  display: flex; align-items: center; justify-content: space-between;
  height: 52px; padding: 0 1.25rem;
}

/* Logo */
.logo { display: flex; align-items: center; gap: .5rem; text-decoration: none; }
.logo-icon {
  width: 30px; height: 30px; border-radius: 8px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-secondary));
  display: flex; align-items: center; justify-content: center;
  color: var(--color-on-accent);
}
.logo-text { font-size: .9375rem; font-weight: 700; letter-spacing: -.02em; color: var(--color-primary); }
.logo-dot { color: var(--color-accent); margin: 0 1px; }
.logo-sub { font-weight: 500; }
@media (max-width: 480px) { .logo-sub { display: none; } }

/* Nav Center */
.nav-center { display: none; }
@media (min-width: 640px) { .nav-center { display: flex; align-items: center; gap: .125rem; } }

.nav-link, .nav-actions .nav-link {
  padding: .375rem .75rem; border-radius: 999px;
  font-size: .8125rem; font-weight: 500;
  color: var(--color-muted); text-decoration: none;
  transition: background .2s, color .2s;
  white-space: nowrap;
}
.nav-link:hover { background: color-mix(in srgb, var(--color-foreground) 8%, transparent); color: var(--color-foreground); }
.nav-link.active { color: var(--color-accent); background: color-mix(in srgb, var(--color-accent) 12%, transparent); }
.nav-link.router-link-exact-active,
.nav-link.router-link-active { color: var(--color-accent); background: color-mix(in srgb, var(--color-accent) 12%, transparent); }

.nav-actions { display: flex; align-items: center; gap: .25rem; }

/* More dropdown */
.more-wrap { position: relative; }
.more-chevron { margin-left: 2px; transition: transform .2s; }
.more-wrap:hover .more-chevron { transform: rotate(180deg); }
.more-wrap:hover .more-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
.more-dropdown {
  position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(-4px);
  width: 140px; padding: 4px; border-radius: 12px;
  background: color-mix(in srgb, var(--color-panel) 92%, transparent);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid var(--color-border-strong);
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
  opacity: 0; visibility: hidden; transition: all .2s ease; z-index: 50;
}
.more-item {
  display: block; padding: .375rem .75rem; border-radius: 8px;
  font-size: .8125rem; color: var(--color-muted); text-decoration: none;
  transition: background .15s;
}
.more-item:hover { background: color-mix(in srgb, var(--color-accent) 10%, transparent); color: var(--color-foreground); }

/* Action buttons */
.action-btn {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border-radius: 999px;
  color: var(--color-muted); text-decoration: none;
  transition: background .2s;
}
.action-btn:hover { background: color-mix(in srgb, var(--color-foreground) 8%, transparent); color: var(--color-foreground); }

/* ── Theme Toggle (button.md) ── */
.ts-toggle {
  --size: 16px; --cw: 4.8em; --ch: 2.2em; --cd: 3em; --sm: 1.9em;
  font-size: var(--size); cursor: pointer;
}
.ts-toggle * { box-sizing: border-box; }
.ts-checkbox { display: none; }
.ts-container {
  width: var(--cw); height: var(--ch);
  background: linear-gradient(135deg, #3D7EAE, #2a6a96);
  border-radius: 6.25em; overflow: hidden; position: relative;
  box-shadow: inset 0 1px 2px rgba(0,0,0,.2), 0 1px 3px rgba(255,255,255,.3);
  transition: background .5s cubic-bezier(0,-.02,.4,1.25);
}
.ts-container::before {
  content: ''; position: absolute; inset: 0;
  box-shadow: inset 0 2px 4px rgba(0,0,0,.15);
  border-radius: inherit; z-index: 1;
}
.ts-circle {
  width: var(--cd); height: var(--cd); position: absolute;
  left: calc((var(--cd) - var(--ch)) / 2 * -1);
  top: calc((var(--cd) - var(--ch)) / 2 * -1);
  border-radius: 50%;
  box-shadow: inset 0 0 0 3em rgba(255,255,255,.08), 0 0 0 .5em rgba(255,255,255,.06);
  display: flex; align-items: center; justify-content: center;
  transition: left .3s cubic-bezier(0,-.02,.35,1.17); pointer-events: none;
}
.ts-sun-moon {
  position: relative; z-index: 2; width: var(--sm); height: var(--sm);
  border-radius: 50%; background: #ECCA2F;
  box-shadow: inset 0 1px 2px rgba(254,255,239,.5), inset 0 -1px 2px #a1872a;
  overflow: hidden; transition: background .5s cubic-bezier(0,-.02,.4,1.25);
  filter: drop-shadow(1px 2px 2px rgba(0,0,0,.2));
}
.ts-moon {
  transform: translateX(100%); width: 100%; height: 100%;
  background: #C4C9D1; border-radius: inherit;
  box-shadow: inset 0 1px 2px rgba(254,255,239,.5), inset 0 -1px 2px #969696;
  transition: transform .5s cubic-bezier(0,-.02,.4,1.25); position: relative;
}
.ts-spot { position: absolute; border-radius: 50%; background: #959DB1; box-shadow: inset 0 1px 1px rgba(0,0,0,.15); }
.ts-spot:nth-child(1) { width: .65em; height: .65em; top: .65em; left: .25em; }
.ts-spot:nth-child(2) { width: .35em; height: .35em; top: .8em; left: 1.1em; }
.ts-spot:nth-child(3) { width: .22em; height: .22em; top: .25em; left: .65em; }
.ts-clouds {
  position: absolute; bottom: -.45em; left: .25em; width: 1em; height: 1em;
  background: #F3FDFF; border-radius: 50%;
  transition: bottom .5s cubic-bezier(0,-.02,.4,1.25);
  box-shadow: .7em .25em #F3FDFF,-.2em -.25em #AACADF,1.1em .3em #F3FDFF,.4em -.1em #AACADF,1.8em 0 #F3FDFF,1em -.05em #AACADF,2.4em .25em #F3FDFF,1.6em -.25em #AACADF,3em -.05em #F3FDFF,2.1em 0 #AACADF,3.7em -.25em #F3FDFF,2.8em -.35em #AACADF,3.9em -1.5em 0 .35em #F3FDFF,3.3em -.5em #AACADF,3.5em -1.8em 0 .35em #AACADF;
}
.ts-stars { position: absolute; top: -100%; left: .25em; width: 2.75em; height: auto; color: #fff; transition: top .5s cubic-bezier(0,-.02,.4,1.25); }
.ts-checkbox:checked + .ts-container { background: linear-gradient(135deg, #1D1F2C, #2a2d3e); }
.ts-checkbox:checked + .ts-container .ts-circle { left: calc(100% - ((var(--cd) - var(--ch)) / 2 * -1) - var(--cd)); }
.ts-checkbox:checked + .ts-container .ts-sun-moon { background: #C4C9D1; }
.ts-checkbox:checked + .ts-container .ts-moon { transform: translateX(0); }
.ts-checkbox:checked + .ts-container .ts-clouds { bottom: -3.5em; }
.ts-checkbox:checked + .ts-container .ts-stars { top: 50%; transform: translateY(-50%); }

/* ── button6 ── */
.b6-btn {
  --white: #ffe7ff; --purple-100: #f4b1fd; --purple-200: #d190ff;
  --purple-300: #c389f2; --purple-400: #8e26e2; --purple-500: #5e2b83;
  --radius: 14px;
  display: inline-flex; border-radius: var(--radius); outline: none; cursor: pointer;
  font-family: inherit; background: transparent; border: 0;
  position: relative; height: 44px; text-decoration: none;
}
.b6-bg { position: absolute; inset: 0; border-radius: inherit; filter: blur(1px); }
.b6-bg::before, .b6-bg::after {
  content: ''; position: absolute; inset: 0;
  border-radius: calc(var(--radius) * 1.1); background: var(--purple-500);
}
.b6-bg::before {
  filter: blur(5px); transition: all .3s ease;
  box-shadow: -4px 4px 0 0 rgb(115 75 155 / 40%), -8px 8px 0 0 rgb(115 75 155 / 30%), -12px 10px 4px 0 rgb(115 75 155 / 25%);
}
.b6-wrap { border-radius: inherit; overflow: hidden; transform: translate(4px, -4px); padding: 2px; background: linear-gradient(to bottom, var(--purple-100), var(--purple-400)); position: relative; transition: all .3s ease; }
.b6-outline { position: absolute; overflow: hidden; inset: 0; opacity: 0; outline: none; border-radius: inherit; transition: all .4s ease; }
.b6-outline::before { content: ''; position: absolute; inset: 2px; width: 80px; height: 200px; margin: auto; background: linear-gradient(to right, transparent 0%, white 50%, transparent 100%); animation: b6-spin 3s linear infinite; animation-play-state: paused; }
.b6-content { pointer-events: none; display: flex; align-items: center; justify-content: center; z-index: 1; position: relative; height: 100%; gap: 8px; border-radius: calc(var(--radius) * 0.85); font-weight: 600; font-size: .8125rem; transition: all .3s ease; padding: 0 1.125rem; background: linear-gradient(to bottom, var(--purple-300), var(--purple-400)); box-shadow: inset -2px 8px 8px -4px var(--purple-200), inset 1px -2px 8px 0 rgb(0 0 0 / 35%); color: var(--white); }
.b6-content::before { content: ''; inset: 0; position: absolute; z-index: -1; width: 80%; top: 45%; bottom: 35%; opacity: .5; margin: auto; background: linear-gradient(to bottom, transparent, var(--purple-400)); filter: brightness(1.3) blur(5px); }
.b6-char { display: flex; }
.b6-char span { display: block; position: relative; color: var(--white); text-shadow: -1px 1px 2px var(--purple-500); }
.b6-btn:hover .b6-wrap { transform: translate(5px, -5px); }
.b6-btn:hover .b6-outline { opacity: 1; }
.b6-btn:hover .b6-outline::before { animation-play-state: running; }
.b6-btn:active .b6-bg::before { filter: blur(5px); opacity: .7; box-shadow: -4px 4px 0 0 rgb(115 75 155 / 40%), -8px 8px 0 0 rgb(115 75 155 / 25%), -12px 10px 4px 0 rgb(115 75 155 / 15%); }
.b6-btn:active .b6-content { box-shadow: inset -1px 8px 6px -4px rgba(71,0,137,.4), inset 0 -2px 6px 0 var(--purple-200); }
.b6-btn:active .b6-outline { opacity: 0; }
.b6-btn:active .b6-wrap { transform: translate(2px, -2px); }
@keyframes b6-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* ── 极光背景 ── */
.aurora-layer { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.aurora-layer::before {
  content: ''; position: absolute; inset: 0;
  background-image: repeating-linear-gradient(0deg, transparent, transparent 40px, color-mix(in srgb, var(--color-muted) 3%, transparent) 40px, color-mix(in srgb, var(--color-muted) 3%, transparent) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, color-mix(in srgb, var(--color-muted) 3%, transparent) 40px, color-mix(in srgb, var(--color-muted) 3%, transparent) 41px);
  z-index: 2;
}
.aurora-layer::after {
  content: ''; position: absolute; inset: 0; z-index: 1;
  background: radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in srgb, var(--color-accent) 25%, transparent), transparent), radial-gradient(ellipse 50% 40% at 0% 60%, color-mix(in srgb, var(--color-secondary) 20%, transparent), transparent), radial-gradient(ellipse 50% 40% at 100% 40%, color-mix(in srgb, var(--color-accent) 15%, transparent), transparent), radial-gradient(ellipse 60% 30% at 30% 80%, color-mix(in srgb, var(--color-tertiary) 18%, transparent), transparent);
  animation: aurora 20s infinite ease-in-out; filter: blur(60px) saturate(1.4);
}
@keyframes aurora { 0%, 100% { transform: scale(1) rotate(0deg); opacity: .7; } 33% { transform: scale(1.05) rotate(1deg); opacity: .9; } 66% { transform: scale(0.95) rotate(-1deg); opacity: .6; } }

/* ── Hamburger ── */
.hamburger { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 999px; border: none; background: transparent; color: var(--color-muted); cursor: pointer; transition: background .2s; }
.hamburger:hover { background: color-mix(in srgb, var(--color-foreground) 8%, transparent); }
@media (min-width: 640px) { .hamburger { display: none; } }

/* ── Mobile ── */
.mobile-menu { padding: .75rem 1rem 1rem; border-top: 1px solid var(--color-border); display: flex; flex-direction: column; gap: .375rem; }
.mobile-link { display: block; padding: .5rem .75rem; border-radius: 10px; font-size: .875rem; font-weight: 500; color: var(--color-muted); text-decoration: none; transition: background .2s; }
.mobile-link:hover { background: color-mix(in srgb, var(--color-foreground) 6%, transparent); }
.mobile-section { padding: .5rem .75rem; }
.mobile-label { font-size: .6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--color-muted); margin-bottom: .5rem; }
.mobile-themes { display: flex; flex-wrap: wrap; gap: .375rem; }
.mobile-themes button { padding: .25rem .625rem; border-radius: 999px; border: 1px solid var(--color-border); background: transparent; color: var(--color-muted); font-size: .75rem; cursor: pointer; transition: all .15s; }
.mobile-themes button.active { border-color: var(--color-accent); color: var(--color-accent); }

.mobile-enter-active, .mobile-leave-active { transition: all .2s ease; }
.mobile-enter-from, .mobile-leave-to { opacity: 0; max-height: 0; overflow: hidden; }

/* ── Footer ── */
.footer {
  position: relative; z-index: 1;
  border-top: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent);
  padding: 3rem 1.25rem 2.5rem;
  background: color-mix(in srgb, var(--color-surface) 40%, transparent);
}
.footer-grid { max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: 1.5fr repeat(3, 1fr); gap: 2rem; }
@media (max-width: 640px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; } }
.footer-col { display: flex; flex-direction: column; }
.footer-h { font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--color-muted); margin-bottom: .75rem; }
.footer-links { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .375rem; }
.footer-links a { font-size: .75rem; color: var(--color-muted); text-decoration: none; transition: color .2s; }
.footer-links a:hover { color: var(--color-accent); }
.footer-tag { padding: .125rem .5rem; border-radius: 999px; border: 1px solid var(--color-border); font-size: .6875rem; color: var(--color-muted); }

/* ── Utility classes ── */
.soft-motion { transition: all .25s cubic-bezier(0.22,1,0.36,1); }
.text-glow { text-shadow: 0 0 20px color-mix(in srgb, transparent 40%, currentColor), 0 0 40px color-mix(in srgb, transparent 60%, currentColor); }
.text-glow-strong { text-shadow: 0 0 30px currentColor, 0 0 60px currentColor; }
.text-gradient-glow {
  background: linear-gradient(135deg, var(--color-accent), var(--color-secondary), var(--color-tertiary));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  filter: drop-shadow(0 0 12px color-mix(in srgb, var(--color-accent) 30%, transparent));
}
.stellara-glow { box-shadow: 0 0 0 1px var(--color-border), 0 0 20px color-mix(in srgb, var(--color-accent) 10%, transparent); }

/* ── Animations ── */
@keyframes float-up { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-accent) 30%, transparent); } 70% { box-shadow: 0 0 0 8px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
@keyframes twinkle { 0%, 100% { opacity: .3; } 50% { opacity: 1; } }
@keyframes drift-slow { 0%, 100% { transform: translate(0, 0) scale(1); } 25% { transform: translate(20px, -30px) scale(1.05); } 50% { transform: translate(-10px, 20px) scale(0.95); } 75% { transform: translate(30px, 10px) scale(1.02); } }

/* ── Search Overlay ── */
.srch-overlay {
  position: fixed; inset: 0; z-index: 2000;
  background: color-mix(in srgb, var(--color-background) 85%, transparent);
  backdrop-filter: blur(8px);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 6rem 1rem;
}
.srch-box {
  display: flex; align-items: center; gap: .5rem;
  width: 100%; max-width: 420px; padding: .75rem 1rem;
  border-radius: 14px; border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 8px 32px rgba(0,0,0,.15);
}
.srch-input {
  flex: 1; border: none; outline: none; background: transparent;
  color: var(--color-foreground); font-size: .9375rem;
}
.srch-input::placeholder { color: var(--color-muted); }
.mn-srch-enter-active, .mn-srch-leave-active { transition: all .2s ease; }
.mn-srch-enter-from, .mn-srch-leave-to { opacity: 0; }
</style>
