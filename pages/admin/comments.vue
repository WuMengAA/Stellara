<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { get, patch, del } = useAuthFetch()

interface Comment {
  id: string
  content: string
  createdAt: string
  isHidden: boolean
  article: { title: string }
  author: { name: string }
}

const comments = ref<Comment[]>([])
const loading = ref(true)
const toggling = ref<Set<string>>(new Set())
const deleting = ref<Set<string>>(new Set())

async function loadComments() {
  loading.value = true
  try {
    const res = await get<{ data: Comment[] }>('/api/comments?order=desc&orderBy=createdAt')
    comments.value = res.data
  } finally {
    loading.value = false
  }
}

async function toggleVisibility(comment: Comment) {
  const id = comment.id
  toggling.value.add(id)
  try {
    await patch(`/api/comments/${id}`, { isHidden: !comment.isHidden })
    comment.isHidden = !comment.isHidden
  } finally {
    toggling.value.delete(id)
    await loadComments()
  }
}

async function removeComment(id: string) {
  if (!confirm('Delete this comment?')) return
  deleting.value.add(id)
  try {
    await del(`/api/comments/${id}`)
  } finally {
    deleting.value.delete(id)
    await loadComments()
  }
}

onMounted(loadComments)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold tracking-tight" style="color: var(--color-foreground)">Comments</h1>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-24">
      <div class="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
        style="border-color: var(--color-border); border-top-color: var(--color-accent)" />
    </div>

    <div v-else-if="!comments.length" class="flex flex-col items-center justify-center py-24 gap-3">
      <div class="text-4xl opacity-30" style="color: var(--color-muted)">💬</div>
      <p class="text-sm font-medium" style="color: var(--color-muted)">No comments yet</p>
    </div>

    <div v-else class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-surface)">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b text-xs font-semibold uppercase tracking-widest"
            style="border-color: var(--color-border); color: var(--color-muted); background: var(--color-surface-2)">
            <th class="text-left px-4 py-3 font-medium">Article</th>
            <th class="text-left px-4 py-3 font-medium">Author</th>
            <th class="text-left px-4 py-3 font-medium">Content</th>
            <th class="text-left px-4 py-3 font-medium">Date</th>
            <th class="text-left px-4 py-3 font-medium">Status</th>
            <th class="text-right px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in comments" :key="comment.id"
            class="border-b transition-colors hover:opacity-90"
            style="border-color: var(--color-border)">
            <td class="px-4 py-3 max-w-40 truncate font-medium" style="color: var(--color-foreground)">
              {{ comment.article.title }}
            </td>
            <td class="px-4 py-3" style="color: var(--color-muted)">
              {{ comment.author.name }}
            </td>
            <td class="px-4 py-3 max-w-60 truncate" style="color: var(--color-muted)">
              {{ comment.content.length > 100 ? comment.content.slice(0, 100) + '…' : comment.content }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-xs" style="color: var(--color-muted)">
              {{ new Date(comment.createdAt).toLocaleDateString() }}
            </td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                :style="{
                  background: comment.isHidden ? 'var(--color-surface-2)' : 'var(--color-accent)/10',
                  color: comment.isHidden ? 'var(--color-muted)' : 'var(--color-accent)'
                }">
                <span class="w-1.5 h-1.5 rounded-full"
                  :style="{ background: comment.isHidden ? 'var(--color-muted)' : 'var(--color-accent)' }" />
                {{ comment.isHidden ? 'Hidden' : 'Visible' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <button :disabled="toggling.has(comment.id)"
                  @click="toggleVisibility(comment)"
                  class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
                  :style="{
                    background: comment.isHidden ? 'var(--color-accent)/10' : 'var(--color-surface-2)',
                    color: comment.isHidden ? 'var(--color-accent)' : 'var(--color-muted)'
                  }">
                  {{ toggling.has(comment.id) ? '…' : comment.isHidden ? 'Show' : 'Hide' }}
                </button>
                <button :disabled="deleting.has(comment.id)"
                  @click="removeComment(comment.id)"
                  class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
                  style="background: var(--color-surface-2); color: var(--color-muted)">
                  {{ deleting.has(comment.id) ? '…' : 'Delete' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
