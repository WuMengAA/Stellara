<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const auth = useAuthFetch()

const [{ data: articlesRes }, { data: tagsRes }, { data: usersRes }] = await Promise.all([
  useFetch('/api/articles?perPage=10'),
  useFetch('/api/tags'),
  auth.get('/api/users'),
])

const articles = computed(() => (articlesRes.value as any)?.data?.articles || [])
const tags = computed(() => (tagsRes.value as any)?.data || [])
const users = computed(() => (usersRes.value as any)?.data?.users || [])

const articleCount = computed(() => (articlesRes.value as any)?.meta?.total || articles.value.length)
const tagCount = computed(() => tags.value.length)
const userCount = computed(() => users.value.length)

const stats = [
  { label: 'Articles', value: articleCount, to: '/admin/articles', icon: 'file-text' },
  { label: 'Tags', value: tagCount, to: '/admin/tags', icon: 'tag' },
  { label: 'Comments', value: 0, to: '/admin/comments', icon: 'message-square' },
  { label: 'Users', value: userCount, to: '/admin/users', icon: 'users' },
]

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-lg font-semibold" :style="{ color: 'var(--color-foreground)' }">Dashboard</h1>
      <p class="text-sm mt-1" :style="{ color: 'var(--color-muted)' }">Overview of your site</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <NuxtLink
        v-for="stat in stats"
        :key="stat.label"
        :to="stat.to"
        class="rounded-xl border p-5 transition-all hover:scale-[1.02]"
        :style="{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }"
      >
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium uppercase tracking-wider" :style="{ color: 'var(--color-muted)' }">
            {{ stat.label }}
          </span>
          <svg class="w-4 h-4" :style="{ color: 'var(--color-muted)' }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path v-if="stat.icon === 'file-text'" stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            <path v-if="stat.icon === 'tag'" stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path v-if="stat.icon === 'message-square'" stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            <path v-if="stat.icon === 'users'" stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold tracking-tight" :style="{ color: 'var(--color-foreground)' }">
          {{ stat.value }}
        </p>
      </NuxtLink>
    </div>

    <div class="rounded-xl border" :style="{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
      <div class="flex items-center justify-between px-5 py-4 border-b" :style="{ borderColor: 'var(--color-border)' }">
        <h2 class="text-sm font-semibold" :style="{ color: 'var(--color-foreground)' }">Recent Articles</h2>
        <NuxtLink to="/admin/articles" class="text-xs font-medium transition-colors hover:opacity-80" :style="{ color: 'var(--color-accent)' }">
          View all &rarr;
        </NuxtLink>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs font-medium uppercase tracking-wider" :style="{ color: 'var(--color-muted)' }">
              <th class="px-5 py-3 font-medium">Title</th>
              <th class="px-5 py-3 font-medium">Status</th>
              <th class="px-5 py-3 font-medium">Views</th>
              <th class="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(article, i) in articles"
              :key="article.id"
              :style="i % 2 === 0 ? {} : { background: 'var(--color-surface-2)' }"
              class="transition-colors hover:opacity-80"
            >
              <td class="px-5 py-3 max-w-xs truncate font-medium" :style="{ color: 'var(--color-foreground)' }">
                <NuxtLink :to="`/admin/articles/${article.id}`" class="hover:underline">
                  {{ article.title }}
                </NuxtLink>
              </td>
              <td class="px-5 py-3">
                <span
                  class="inline-block px-2 py-0.5 rounded text-[11px] font-medium"
                  :style="{
                    background: article.status === 'published' ? 'var(--color-accent)' : 'var(--color-muted)',
                    color: '#fff',
                  }"
                >
                  {{ article.status }}
                </span>
              </td>
              <td class="px-5 py-3" :style="{ color: 'var(--color-muted)' }">{{ article.viewCount }}</td>
              <td class="px-5 py-3 whitespace-nowrap" :style="{ color: 'var(--color-muted)' }">{{ formatDate(article.createdAt) }}</td>
            </tr>
            <tr v-if="!articles.length">
              <td colspan="4" class="px-5 py-8 text-center text-sm" :style="{ color: 'var(--color-muted)' }">
                No articles yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <h2 class="text-sm font-semibold mb-3" :style="{ color: 'var(--color-foreground)' }">Quick Links</h2>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="link in [
            { label: 'New Article', to: '/admin/articles/new' },
            { label: 'Manage Tags', to: '/admin/tags' },
            { label: 'Comments', to: '/admin/comments' },
            { label: 'Users', to: '/admin/users' },
          ]"
          :key="link.label"
          :to="link.to"
          class="px-4 py-2 rounded-lg border text-xs font-medium transition-all hover:border-[var(--color-accent)]"
          :style="{ borderColor: 'var(--color-border)', color: 'var(--color-muted)', background: 'var(--color-surface)' }"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
