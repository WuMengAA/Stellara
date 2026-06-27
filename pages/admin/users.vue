<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { get, patch, delete: del } = useAuthFetch()
const users = ref<any[]>([])
const editingRole = ref<string | null>(null)
const deletingId = ref<string | null>(null)
const loading = ref(false)

async function fetchUsers() {
  loading.value = true
  try {
    users.value = await get('/api/users')
  } finally {
    loading.value = false
  }
}

async function changeRole(id: string, role: string) {
  await patch(`/api/users/${id}`, { role })
  editingRole.value = null
  fetchUsers()
}

async function toggleStatus(id: string, current: string) {
  const status = current === 'active' ? 'banned' : 'active'
  await patch(`/api/users/${id}`, { status })
  fetchUsers()
}

async function confirmDelete(id: string) {
  await del(`/api/users/${id}`)
  deletingId.value = null
  fetchUsers()
}

fetchUsers()
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold" style="color: var(--color-foreground)">Users</h2>
      <span class="text-xs px-2.5 py-1 rounded-full" :style="{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }">
        {{ users.length }} total
      </span>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" :style="{ borderColor: 'var(--color-muted)', borderTopColor: 'transparent' }" />
    </div>

    <div v-else class="overflow-hidden rounded-xl border" :style="{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }">
      <table class="w-full text-sm">
        <thead>
          <tr :style="{ background: 'var(--color-surface-2)' }">
            <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" :style="{ color: 'var(--color-muted)' }">Name</th>
            <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" :style="{ color: 'var(--color-muted)' }">Email</th>
            <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" :style="{ color: 'var(--color-muted)' }">Role</th>
            <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" :style="{ color: 'var(--color-muted)' }">Status</th>
            <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" :style="{ color: 'var(--color-muted)' }">Joined</th>
            <th class="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider" :style="{ color: 'var(--color-muted)' }">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id" class="border-t transition-colors hover:bg-[var(--color-surface-2)]/50" :style="{ borderColor: 'var(--color-border)' }">
            <td class="px-4 py-3 font-medium" style="color: var(--color-foreground)">{{ u.name }}</td>
            <td class="px-4 py-3" style="color: var(--color-muted)">{{ u.email }}</td>

            <td class="px-4 py-3">
              <div v-if="editingRole === u.id" class="relative">
                <select
                  :value="u.role"
                  @change="changeRole(u.id, ($event.target as HTMLSelectElement).value)"
                  @blur="editingRole = null"
                  class="text-xs px-2 py-1 rounded-lg border outline-none"
                  :style="{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }"
                  autofocus
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <span v-else
                @click="editingRole = u.id"
                class="inline-flex cursor-pointer rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-80"
                :class="u.role === 'admin' ? 'bg-purple-500/15 text-purple-500' : 'bg-blue-500/15 text-blue-500'"
              >
                {{ u.role }}
              </span>
            </td>

            <td class="px-4 py-3">
              <button @click="toggleStatus(u.id, u.status)"
                class="inline-flex cursor-pointer rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all hover:opacity-80"
                :class="u.status === 'active'
                  ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20'
                  : 'bg-red-500/15 text-red-500 border-red-500/20'"
              >
                {{ u.status }}
              </button>
            </td>

            <td class="px-4 py-3 text-xs" style="color: var(--color-muted)">
              {{ new Date(u.createdAt || u.joinedAt).toLocaleDateString() }}
            </td>

            <td class="px-4 py-3 text-right">
              <div v-if="deletingId === u.id" class="inline-flex items-center gap-1.5">
                <span class="text-xs" style="color: var(--color-muted)">Sure?</span>
                <button @click="confirmDelete(u.id)"
                  class="text-xs px-2 py-1 rounded-lg font-medium"
                  :style="{ background: 'var(--color-accent)', color: '#fff' }"
                >Yes</button>
                <button @click="deletingId = null"
                  class="text-xs px-2 py-1 rounded-lg"
                  :style="{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }"
                >No</button>
              </div>
              <button v-else @click="deletingId = u.id"
                class="text-xs px-2.5 py-1 rounded-lg transition-colors hover:bg-red-500/10"
                :style="{ color: 'var(--color-muted)' }"
              >Delete</button>
            </td>
          </tr>

          <tr v-if="!users.length">
            <td colspan="6" class="px-4 py-12 text-center text-sm" :style="{ color: 'var(--color-muted)' }">
              No users found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
