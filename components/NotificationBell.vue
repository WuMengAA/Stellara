<script setup lang="ts">
const auth = useAuthStore()
const { get, patch } = useAuthFetch()

const notifications = ref<any[]>([])
const unreadCount = ref(0)
const open = ref(false)
let pollTimer: ReturnType<typeof setInterval> | null = null

async function fetchNotifications() {
  if (!auth.isLoggedIn) return
  try {
    const res = await get('/api/notifications')
    notifications.value = res.data?.notifications?.slice(0, 10) || []
    unreadCount.value = res.data?.unreadCount || 0
  } catch {
    // silent
  }
}

async function markRead(id: string) {
  await patch(`/api/notifications/${id}/read`)
  notifications.value = notifications.value.map((n: any) =>
    n.id === id ? { ...n, read: true } : n
  )
  unreadCount.value = Math.max(0, unreadCount.value - 1)
}

async function markAllRead() {
  await patch('/api/notifications/read-all')
  notifications.value = notifications.value.map((n: any) => ({ ...n, read: true }))
  unreadCount.value = 0
}

function handleClick(n: any) {
  if (!n.read) markRead(n.id)
  if (n.link) navigateTo(n.link)
  open.value = false
}

onMounted(() => {
  fetchNotifications()
  pollTimer = setInterval(fetchNotifications, 30000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

watch(() => auth.isLoggedIn, (val) => {
  if (val) fetchNotifications()
  else {
    notifications.value = []
    unreadCount.value = 0
  }
})
</script>

<template>
  <div v-if="auth.isLoggedIn" class="notification-wrap" @click.self="open = false">
    <button class="action-btn relative" title="Notifications" @click.stop="open = !open; if (!open) fetchNotifications()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
      </svg>
      <span v-if="unreadCount > 0" class="notification-badge">
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <Transition name="notif">
      <div v-if="open" class="notification-dropdown">
        <div class="notification-header">
          <span class="text-xs font-semibold" style="color: var(--color-foreground)">通知</span>
          <button
            v-if="unreadCount > 0"
            @click="markAllRead"
            class="text-[11px] font-medium transition-colors"
            :style="{ color: 'var(--color-accent)' }"
          >
            全部标记已读
          </button>
        </div>

        <div class="notification-list">
          <div v-if="!notifications.length" class="notification-empty">
            暂无通知
          </div>
          <button
            v-for="n in notifications"
            :key="n.id"
            @click="handleClick(n)"
            class="notification-item"
            :class="{ unread: !n.read }"
          >
            <div class="flex items-start gap-2.5">
              <span
                class="mt-1 w-2 h-2 rounded-full shrink-0"
                :style="{ background: n.read ? 'transparent' : 'var(--color-accent)' }"
              />
              <div class="text-left flex-1 min-w-0">
                <p class="text-xs leading-relaxed" style="color: var(--color-foreground)">
                  {{ n.title }}
                </p>
                <p class="text-[11px] mt-0.5" style="color: var(--color-muted)">
                  {{ new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.notification-wrap {
  position: relative;
}

.action-btn {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border-radius: 999px;
  color: var(--color-muted); text-decoration: none;
  transition: background .2s;
}
.action-btn:hover { background: color-mix(in srgb, var(--color-foreground) 8%, transparent); color: var(--color-foreground); }

.notification-badge {
  position: absolute; top: 3px; right: 3px;
  min-width: 16px; height: 16px; padding: 0 4px;
  border-radius: 999px; background: #ef4444;
  color: #fff; font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  line-height: 1;
}

.notification-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  width: 320px; max-height: 420px;
  border-radius: 12px; overflow: hidden;
  background: color-mix(in srgb, var(--color-panel) 92%, transparent);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid var(--color-border-strong);
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
  z-index: 1001;
  display: flex; flex-direction: column;
}

.notification-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-border);
}

.notification-list {
  overflow-y: auto; max-height: 360px;
  padding: 4px;
}

.notification-empty {
  padding: 24px 14px; text-align: center;
  font-size: 12px; color: var(--color-muted);
}

.notification-item {
  display: block; width: 100%;
  padding: 8px 10px; border-radius: 8px;
  text-align: left; background: transparent; border: none;
  cursor: pointer; transition: background .15s;
}
.notification-item:hover { background: color-mix(in srgb, var(--color-accent) 8%, transparent); }
.notification-item.unread { background: color-mix(in srgb, var(--color-accent) 4%, transparent); }

/* ── Transition ── */
.notif-enter-active, .notif-leave-active {
  transition: all .15s ease;
}
.notif-enter-from, .notif-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
