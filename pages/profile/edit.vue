<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore()
const router = useRouter()
const theme = useTheme()

const name = ref(auth.user?.name || '')
const bio = ref(auth.user?.bio || '')
const tagline = ref(auth.user?.tagline || '')
const avatar = ref(auth.user?.avatar || '')
const email = ref(auth.user?.email || '')
const saving = ref(false)
const saved = ref(false)
const error = ref('')

async function save() {
  error.value = ''; saved.value = false
  if (!name.value.trim()) { error.value = '名字不能为空'; return }
  saving.value = true
  try {
    const res = await $fetch(`/api/users/${auth.user.id}`, {
      method: 'PATCH',
      body: { name: name.value, bio: bio.value, tagline: tagline.value, avatar: avatar.value },
    }) as any
    auth.setUser(res.data)
    saved.value = true
    setTimeout(() => { if (!saving.value) saved.value = false }, 2000)
  } catch (e: any) {
    error.value = e.data?.message || e.message || '保存失败'
  }
  saving.value = false
}
</script>

<template>
  <div class="max-w-lg mx-auto space-y-8" :class="[`theme-${theme.theme.value}`, `perf-${theme.perfMode.value}`]">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold">编辑个人资料</h1>
        <p class="text-xs mt-0.5" style="color: var(--color-muted)">修改你的公开信息</p>
      </div>
      <button @click="router.back()" class="text-xs" style="color: var(--color-muted)">返回</button>
    </div>

    <div class="ed-card space-y-6">
      <!-- Avatar -->
      <div class="flex items-center gap-4">
        <div class="relative">
          <span class="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] flex items-center justify-center text-white text-xl font-bold">
            {{ (avatar.value || name.value)?.[0]?.toUpperCase() || 'U' }}
          </span>
          <span class="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[10px]" style="color: var(--color-muted)">+</span>
        </div>
        <div class="flex-1">
          <p class="text-xs font-medium">头像链接</p>
          <input v-model="avatar" placeholder="https://..." class="ed-input mt-1" />
        </div>
      </div>

      <!-- Name -->
      <div>
        <p class="text-xs font-medium">名称 <span style="color:#ef4444">*</span></p>
        <input v-model="name" maxlength="50" class="ed-input mt-1" />
      </div>

      <!-- Email (read-only) -->
      <div>
        <p class="text-xs font-medium">邮箱</p>
        <input :value="email" disabled class="ed-input mt-1 opacity-60" />
      </div>

      <!-- Tagline -->
      <div>
        <p class="text-xs font-medium">签名</p>
        <input v-model="tagline" maxlength="200" placeholder="一句话介绍自己" class="ed-input mt-1" />
      </div>

      <!-- Bio -->
      <div>
        <p class="text-xs font-medium">个人简介</p>
        <textarea v-model="bio" rows="4" maxlength="500" placeholder="写点关于你的东西…" class="ed-input mt-1 resize-none"></textarea>
        <p class="text-[.625rem] mt-1 text-right" style="color: var(--color-muted)">{{ bio.length }}/500</p>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 pt-2">
        <button @click="save" :disabled="saving" class="b6-btn" style="height:40px">
          <span class="b6-bg"></span>
          <span class="b6-wrap"><span class="b6-outline"></span><span class="b6-content" style="font-size:13px;padding:0 1.5rem">{{ saving ? '保存中…' : '保存' }}</span></span>
        </button>
        <span v-if="saved" class="text-xs" style="color: #10b981">已保存 ✓</span>
        <span v-if="error" class="text-xs" style="color: #ef4444">{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ed-card {
  padding: 1.5rem; border-radius: 16px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 50%, transparent);
  backdrop-filter: blur(8px);
}
.ed-input {
  display: block; width: 100%; padding: .5rem .75rem;
  border-radius: 10px; border: 1px solid var(--color-border);
  background: var(--color-background); color: var(--color-foreground);
  font-size: .875rem; outline: none; transition: border-color .2s;
}
.ed-input:focus { border-color: var(--color-accent); }
</style>
