<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { get, post, delete: del } = useAuthFetch()

interface Tag {
  id: string
  slug: string
  name: string
  description: string | null
  color: string | null
  status: string
  usageCount: number
  orderIdx: number
  createdAt: string
}

const tags = ref<Tag[]>([])
const loading = ref(true)
const showForm = ref(false)
const deleting = ref<string | null>(null)

const form = reactive({ name: '', slug: '', color: '#6d28d9' })

async function fetchTags() {
  loading.value = true
  try {
    const res = await get<{ data: Tag[] }>('/api/tags')
    tags.value = res.data
  } catch {}
  loading.value = false
}

async function createTag() {
  try {
    await post('/api/tags', { ...form })
    form.name = ''
    form.slug = ''
    showForm.value = false
    await fetchTags()
  } catch {}
}

async function deleteTag(slug: string) {
  deleting.value = slug
  try {
    await del(`/api/tags/${slug}`)
    await fetchTags()
  } catch {}
  deleting.value = null
}

function confirmDelete(slug: string) {
  if (confirm('确定要删除这个标签吗？')) deleteTag(slug)
}

function autoSlug() {
  form.slug = form.name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
}

fetchTags()
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <p class="text-xs" style="color: var(--color-muted)">共 {{ tags.length }} 个标签</p>
      <button
        v-if="!showForm"
        @click="showForm = true"
        class="text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150"
        :style="{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }"
      >
        + 新建标签
      </button>
    </div>

    <div
      v-if="showForm"
      class="flex items-end gap-3 p-4 mb-4 rounded-xl border"
      :style="{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }"
    >
      <div class="flex-1 space-y-1">
        <label class="text-[10px] font-medium uppercase tracking-wider" style="color: var(--color-muted)">名称</label>
        <input
          v-model="form.name"
          @input="autoSlug"
          placeholder="标签名称"
          class="w-full px-2.5 py-1.5 rounded-lg text-xs border outline-none transition-colors"
          :style="{ background: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }"
        />
      </div>
      <div class="flex-1 space-y-1">
        <label class="text-[10px] font-medium uppercase tracking-wider" style="color: var(--color-muted)">Slug</label>
        <input
          v-model="form.slug"
          placeholder="tag-slug"
          class="w-full px-2.5 py-1.5 rounded-lg text-xs border outline-none transition-colors"
          :style="{ background: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }"
        />
      </div>
      <div class="w-20 space-y-1">
        <label class="text-[10px] font-medium uppercase tracking-wider" style="color: var(--color-muted)">颜色</label>
        <input
          v-model="form.color"
          type="color"
          class="w-full h-[34px] rounded-lg border cursor-pointer outline-none"
          :style="{ background: 'var(--color-background)', borderColor: 'var(--color-border)' }"
        />
      </div>
      <div class="flex gap-2">
        <button
          @click="showForm = false"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          :style="{ color: 'var(--color-muted)', background: 'var(--color-surface-2)' }"
        >
          取消
        </button>
        <button
          @click="createTag"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          :style="{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }"
        >
          创建
        </button>
      </div>
    </div>

    <div
      class="rounded-xl border overflow-hidden"
      :style="{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }"
    >
      <table class="w-full text-xs">
        <thead>
          <tr :style="{ background: 'var(--color-surface-2)' }">
            <th class="text-left font-medium px-4 py-3" style="color: var(--color-muted); width: 60px">颜色</th>
            <th class="text-left font-medium px-4 py-3" style="color: var(--color-muted)">名称</th>
            <th class="text-left font-medium px-4 py-3" style="color: var(--color-muted)">Slug</th>
            <th class="text-left font-medium px-4 py-3" style="color: var(--color-muted); width: 80px">状态</th>
            <th class="text-right font-medium px-4 py-3" style="color: var(--color-muted); width: 80px">使用量</th>
            <th class="text-right font-medium px-4 py-3" style="color: var(--color-muted); width: 60px">排序</th>
            <th class="text-right font-medium px-4 py-3" style="color: var(--color-muted); width: 80px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tag in tags"
            :key="tag.slug"
            class="border-t transition-colors hover:bg-[var(--color-surface-2)]/50"
            :style="{ borderColor: 'var(--color-border)' }"
          >
            <td class="px-4 py-3">
              <span
                class="inline-block w-4 h-4 rounded-full border"
                :style="{ background: tag.color || 'var(--color-muted)', borderColor: 'var(--color-border)' }"
              />
            </td>
            <td class="px-4 py-3 font-medium" style="color: var(--color-foreground)">{{ tag.name }}</td>
            <td class="px-4 py-3 font-mono" style="color: var(--color-muted)">{{ tag.slug }}</td>
            <td class="px-4 py-3">
              <span
                class="inline-block px-2 py-0.5 rounded text-[10px] font-medium"
                :style="{
                  background: tag.status === 'active' ? 'color-mix(in srgb, var(--color-accent) 15%, transparent)' : 'color-mix(in srgb, var(--color-muted) 15%, transparent)',
                  color: tag.status === 'active' ? 'var(--color-accent)' : 'var(--color-muted)',
                }"
              >
                {{ tag.status === 'active' ? '启用' : '禁用' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right" style="color: var(--color-foreground)">{{ tag.usageCount }}</td>
            <td class="px-4 py-3 text-right font-mono" style="color: var(--color-muted)">{{ tag.orderIdx }}</td>
            <td class="px-4 py-3 text-right">
              <button
                @click="confirmDelete(tag.slug)"
                :disabled="deleting === tag.slug"
                class="px-2.5 py-1 rounded text-[10px] font-medium transition-colors"
                :style="{
                  color: 'var(--color-pink)',
                  background: 'color-mix(in srgb, var(--color-pink) 10%, transparent)',
                  opacity: deleting === tag.slug ? 0.5 : 1,
                }"
              >
                {{ deleting === tag.slug ? '删除中…' : '删除' }}
              </button>
            </td>
          </tr>
          <tr v-if="!loading && tags.length === 0">
            <td colspan="7" class="text-center py-12 text-xs" style="color: var(--color-muted)">暂无标签</td>
          </tr>
          <tr v-if="loading">
            <td colspan="7" class="text-center py-12 text-xs" style="color: var(--color-muted)">加载中…</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
