<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}>()
const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="dialog-overlay" @click.self="emit('cancel')">
      <div class="dialog-box">
        <h3 class="dialog-title">{{ title }}</h3>
        <p class="dialog-message">{{ message }}</p>
        <div class="dialog-actions">
          <button class="dialog-btn" @click="emit('cancel')">{{ cancelText || '取消' }}</button>
          <button
            :class="['dialog-btn', danger ? 'dialog-btn-danger' : 'dialog-btn-primary']"
            @click="emit('confirm')"
          >{{ confirmText || '确认' }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.dialog-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: color-mix(in srgb, var(--color-background) 60%, transparent);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
}
.dialog-box {
  background: var(--color-panel); border: 1px solid var(--color-border);
  border-radius: 12px; padding: 1.5rem; max-width: 380px; width: 90%;
  box-shadow: 0 8px 32px rgba(0,0,0,.3);
}
.dialog-title { font-size: 1rem; font-weight: 600; margin-bottom: .5rem; color: var(--color-foreground); }
.dialog-message { font-size: .8125rem; color: var(--color-muted); line-height: 1.5; margin-bottom: 1.25rem; }
.dialog-actions { display: flex; gap: .5rem; justify-content: flex-end; }
.dialog-btn {
  padding: .4rem 1rem; border-radius: 8px; font-size: .8125rem; font-weight: 500;
  border: 1px solid var(--color-border); cursor: pointer; font-family: inherit;
  background: color-mix(in srgb, var(--color-surface) 40%, transparent);
  color: var(--color-foreground); transition: border-color .2s;
}
.dialog-btn:hover { border-color: var(--color-accent); }
.dialog-btn-primary {
  background: var(--color-accent); color: var(--color-on-accent); border-color: var(--color-accent);
}
.dialog-btn-danger {
  background: #e74c3c; color: #fff; border-color: #e74c3c;
}
.dialog-btn-danger:hover { background: #c0392b; border-color: #c0392b; }
</style>
