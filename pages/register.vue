<script setup lang="ts">
definePageMeta({ layout: false })

const auth = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPw = ref(false)
const theme = useTheme()

async function handleRegister() {
  error.value = ''
  if (!name.value || !email.value || !password.value) { error.value = 'All fields are required'; return }
  if (password.value.length < 6) { error.value = 'Password must be at least 6 characters'; return }
  loading.value = true
  try {
    await auth.register(name.value, email.value, password.value)
    router.push('/admin')
  } catch (e: any) {
    error.value = e.data?.message || e.message || 'Registration failed'
  }
  loading.value = false
}
</script>

<template>
  <div class="login-page" :class="[`theme-${theme.theme.value}`, `perf-${theme.perfMode.value}`]">
    <div class="login-layout">
      <!-- 左侧装饰区 -->
      <div class="login-decor">
        <div class="decor-bg">
          <div class="decor-blob decor-blob--1"></div>
          <div class="decor-blob decor-blob--2"></div>
          <div class="decor-blob decor-blob--3"></div>
        </div>
        <div class="decor-glass"></div>
        <div class="decor-content">
          <div class="decor-brand">
            <span class="decor-logo">S</span>
            <span class="decor-name">Stellara</span>
          </div>
          <div class="decor-illustration">
            <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="140" cy="140" r="120" stroke="currentColor" stroke-width="1" opacity=".15"/>
              <circle cx="140" cy="140" r="80" stroke="currentColor" stroke-width="1" opacity=".1"/>
              <circle cx="140" cy="140" r="40" stroke="currentColor" stroke-width="1" opacity=".2"/>
              <circle cx="140" cy="60" r="4" fill="currentColor" opacity=".4"/>
              <circle cx="60" cy="140" r="3" fill="currentColor" opacity=".3"/>
              <circle cx="220" cy="140" r="5" fill="currentColor" opacity=".3"/>
              <circle cx="140" cy="220" r="3" fill="currentColor" opacity=".4"/>
              <circle cx="100" cy="80" r="2" fill="currentColor" opacity=".5"/>
              <circle cx="190" cy="190" r="2" fill="currentColor" opacity=".5"/>
              <circle cx="80" cy="200" r="2.5" fill="currentColor" opacity=".35"/>
              <circle cx="200" cy="70" r="2.5" fill="currentColor" opacity=".35"/>
              <path d="M140 60 Q160 100 220 100" stroke="currentColor" stroke-width="1.5" opacity=".2" stroke-linecap="round"/>
              <path d="M60 140 Q100 160 140 220" stroke="currentColor" stroke-width="1.5" opacity=".2" stroke-linecap="round"/>
              <circle cx="140" cy="140" r="16" fill="currentColor" opacity=".06"/>
            </svg>
          </div>
          <h2 class="decor-title">Join Stellara</h2>
          <p class="decor-desc">Become part of a community where creativity meets technology</p>
          <div class="decor-tags">
            <span class="decor-tag">✦ Write</span>
            <span class="decor-tag">✦ Share</span>
            <span class="decor-tag">✦ Grow</span>
          </div>
        </div>
      </div>

      <!-- 右侧表单区 -->
      <div class="login-form-side">
        <div class="form-panel">
          <div class="form-header">
            <h1>Create Account</h1>
            <p>Start your Stellara journey</p>
          </div>

          <form @submit.prevent="handleRegister" class="form-body">
            <div class="field">
              <label for="name">Name</label>
              <div class="input-wrap">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input id="name" v-model="name" type="text" required placeholder="Your name" />
              </div>
            </div>

            <div class="field">
              <label for="email">Email</label>
              <div class="input-wrap">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg>
                <input id="email" v-model="email" type="email" required placeholder="you@example.com" />
              </div>
            </div>

            <div class="field">
              <label for="password">Password</label>
              <div class="input-wrap">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <input id="password" v-model="password" :type="showPw ? 'text' : 'password'" required minlength="6" placeholder="At least 6 characters" />
                <button type="button" class="pw-toggle" @click="showPw = !showPw">{{ showPw ? 'Hide' : 'Show' }}</button>
              </div>
            </div>

            <p v-if="error" class="error-msg">{{ error }}</p>

            <button type="submit" :disabled="loading" class="submit-btn">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Creating account…' : 'Create Account' }}
            </button>
          </form>

          <p class="form-footer">
            Already have an account?
            <NuxtLink to="/login">Sign in</NuxtLink>
          </p>
        </div>

        <NuxtLink to="/" class="back-link">← Back to site</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style>
.login-page {
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-foreground);
}
.login-layout {
  display: flex;
  min-height: 100vh;
}

.login-decor {
  display: none;
  position: relative;
  flex: 1;
  overflow: hidden;
}
@media (min-width: 768px) { .login-decor { display: block; } }

.decor-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 500px 400px at 80% 20%, color-mix(in srgb, var(--color-accent) 12%, transparent), transparent 70%),
    radial-gradient(450px circle at 20% 80%, color-mix(in srgb, var(--color-secondary) 10%, transparent), transparent 65%),
    radial-gradient(300px circle at 50% 50%, color-mix(in srgb, var(--color-accent) 8%, transparent), transparent 60%),
    var(--color-background);
}

.decor-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: .4;
  pointer-events: none;
  animation: decor-float 18s infinite ease-in-out;
}
.decor-blob--1 { top: -5%; left: 10%; width: 350px; height: 350px; background: color-mix(in srgb, var(--color-accent) 30%, transparent); }
.decor-blob--2 { bottom: 5%; right: 5%; width: 250px; height: 250px; background: color-mix(in srgb, var(--color-secondary) 25%, transparent); animation-delay: -6s; }
.decor-blob--3 { top: 40%; left: 50%; width: 180px; height: 180px; background: color-mix(in srgb, var(--color-accent) 20%, transparent); animation-delay: -12s; }

@keyframes decor-float {
  0%, 100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(15px,-10px) scale(1.05); }
}

.decor-glass {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--color-background) 10%, transparent);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-right: 1px solid var(--color-border);
  z-index: 1;
  pointer-events: none;
}

.decor-content {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 100%;
  padding: 0 3rem;
  text-align: center;
}

.decor-brand {
  display: inline-flex;
  align-items: center;
  gap: .625rem;
  margin-bottom: 2.5rem;
}
.decor-logo {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px; font-weight: 800;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--color-accent) 30%, transparent);
}
.decor-name { font-size: 1.25rem; font-weight: 700; color: var(--color-foreground); }

.decor-illustration { margin: 0 auto 2rem; color: var(--color-accent); opacity: .7; }

.decor-title { font-size: 1.75rem; font-weight: 700; margin-bottom: .5rem; color: var(--color-foreground); }
.decor-desc { font-size: .875rem; color: var(--color-muted); margin: 0 auto 2rem; max-width: 340px; line-height: 1.6; }
.decor-tags { display: flex; justify-content: center; gap: .75rem; flex-wrap: wrap; }
.decor-tag {
  padding: .375rem 1rem;
  border-radius: 999px;
  font-size: .8125rem;
  color: var(--color-muted);
  background: color-mix(in srgb, var(--color-accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 15%, transparent);
}

.login-form-side {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  background: var(--color-background);
}
@media (min-width: 768px) { .login-form-side { flex: 0 0 420px; } }

.form-panel { width: 100%; max-width: 340px; }

.form-header { text-align: center; margin-bottom: 2rem; }
.form-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--color-foreground); margin-bottom: .25rem; }
.form-header p { font-size: .875rem; color: var(--color-muted); }

.form-body { display: flex; flex-direction: column; gap: 1.25rem; }

.field { display: flex; flex-direction: column; gap: .375rem; }
.field label { font-size: .75rem; font-weight: 600; color: var(--color-muted); text-transform: uppercase; letter-spacing: .04em; }

.input-wrap { position: relative; display: flex; align-items: center; }
.input-icon {
  position: absolute; left: 12px;
  color: var(--color-muted); pointer-events: none; opacity: .6;
}
.input-wrap input {
  width: 100%; height: 44px;
  padding: 0 12px 0 38px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-foreground);
  font-size: .875rem;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.input-wrap input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 12%, transparent);
}
.input-wrap input::placeholder { color: var(--color-muted); opacity: .5; }

.pw-toggle {
  position: absolute; right: 10px;
  padding: 2px 6px; border: none; border-radius: 4px;
  background: transparent; color: var(--color-muted);
  font-size: .6875rem; cursor: pointer;
}
.pw-toggle:hover { color: var(--color-foreground); }

.error-msg {
  padding: .625rem .875rem; border-radius: 8px;
  font-size: .8125rem;
  color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 20%, transparent);
}

.submit-btn {
  display: flex; align-items: center; justify-content: center; gap: .5rem;
  width: 100%; height: 44px;
  border: none; border-radius: 10px;
  background: var(--color-accent); color: #fff;
  font-size: .9375rem; font-weight: 600;
  cursor: pointer;
  transition: transform .15s, box-shadow .15s;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--color-accent) 30%, transparent);
}
.submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px color-mix(in srgb, var(--color-accent) 40%, transparent); }
.submit-btn:active:not(:disabled) { transform: translateY(0); }
.submit-btn:disabled { opacity: .5; cursor: not-allowed; }

.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.form-footer { margin-top: 2rem; text-align: center; font-size: .8125rem; color: var(--color-muted); }
.form-footer a { color: var(--color-accent); font-weight: 600; text-decoration: none; }
.form-footer a:hover { text-decoration: underline; }

.back-link {
  position: absolute; left: 1.5rem; top: 1.5rem;
  font-size: .8125rem; color: var(--color-muted); text-decoration: none; transition: color .2s;
}
.back-link:hover { color: var(--color-foreground); }
</style>
