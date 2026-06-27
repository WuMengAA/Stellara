<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const router = useRouter()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const saving = ref(false)
const saved = ref(false)
const error = ref('')

async function submit() {
  error.value = ''; saved.value = false
  if (!currentPassword.value) { error.value = '请输入当前密码'; return }
  if (!newPassword.value) { error.value = '请输入新密码'; return }
  if (newPassword.value.length < 6) { error.value = '新密码至少需要6个字符'; return }
  if (newPassword.value !== confirmPassword.value) { error.value = '两次输入的新密码不一致'; return }

  saving.value = true
  try {
    await $fetch('/api/users/me/password', {
      method: 'POST',
      body: { currentPassword: currentPassword.value, newPassword: newPassword.value },
    })
    saved.value = true
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    setTimeout(() => { saved.value = false }, 3000)
  } catch (e: any) {
    error.value = e.data?.message || e.message || '修改失败'
  }
  saving.value = false
}
</script>

<template>
  <div class="max-w-lg mx-auto space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold">修改密码</h1>
        <p class="text-xs mt-0.5" style="color: var(--color-muted)">更新你的登录密码</p>
      </div>
      <button @click="router.back()" class="text-xs" style="color: var(--color-muted)">返回</button>
    </div>

    <div class="pwd-card space-y-5">
      <div>
        <p class="text-xs font-medium">当前密码</p>
        <input v-model="currentPassword" type="password" placeholder="输入当前密码" class="pwd-input mt-1" />
      </div>

      <div>
        <p class="text-xs font-medium">新密码</p>
        <input v-model="newPassword" type="password" placeholder="至少6个字符" class="pwd-input mt-1" />
      </div>

      <div>
        <p class="text-xs font-medium">确认新密码</p>
        <input v-model="confirmPassword" type="password" placeholder="再次输入新密码" class="pwd-input mt-1" />
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button @click="submit" :disabled="saving" class="b6-btn" style="height:40px">
          <span class="b6-bg"></span>
          <span class="b6-wrap"><span class="b6-outline"></span><span class="b6-content" style="font-size:13px;padding:0 1.5rem">{{ saving ? '修改中…' : '修改密码' }}</span></span>
        </button>
        <span v-if="saved" class="text-xs" style="color: #10b981">密码已修改 ✓</span>
        <span v-if="error" class="text-xs" style="color: #ef4444">{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pwd-card {
  padding: 1.5rem; border-radius: 16px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 50%, transparent);
  backdrop-filter: blur(8px);
}
.pwd-input {
  display: block; width: 100%; padding: .5rem .75rem;
  border-radius: 10px; border: 1px solid var(--color-border);
  background: var(--color-background); color: var(--color-foreground);
  font-size: .875rem; outline: none; transition: border-color .2s;
}
.pwd-input:focus { border-color: var(--color-accent); }
</style>
