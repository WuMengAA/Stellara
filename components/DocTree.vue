<script setup lang="ts">
defineProps<{
  nodes: any[]
  activeId?: string
}>()
const emit = defineEmits<{
  select: [node: any]
  delete: [node: any]
  reorder: [dragId: string, targetId: string]
}>()

const dragId = ref('')

function onDragStart(node: any) {
  dragId.value = node.id
}

function onDrop(target: any) {
  if (!dragId.value || dragId.value === target.id) return
  emit('reorder', dragId.value, target.id)
  dragId.value = ''
}
</script>

<template>
  <div class="doc-tree">
    <div v-for="node in nodes" :key="node.id" class="doc-tree-node">
      <div
        class="doc-tree-item"
        :class="{
          active: node.id === activeId,
          folder: node.type === 'folder',
          'drag-over': dragId && dragId !== node.id
        }"
        :draggable="node.type !== 'folder'"
        @click="emit('select', node)"
        @dragstart="onDragStart(node)"
        @dragover.prevent
        @drop.prevent="onDrop(node)"
      >
        <span class="doc-tree-icon">
          <span v-if="node.type === 'folder'">{{ node.children?.length ? '📂' : '📁' }}</span>
          <span v-else>📄</span>
        </span>
        <span class="doc-tree-label">{{ node.title }}</span>
        <button
          v-if="node.type !== 'folder'"
          class="doc-tree-del"
          title="删除"
          @click.stop="emit('delete', node)"
        >✕</button>
      </div>
      <div v-if="node.children?.length" class="doc-tree-children">
        <DocTree :nodes="node.children" :active-id="activeId" @select="(n) => emit('select', n)" @delete="(n) => emit('delete', n)" @reorder="(d, t) => emit('reorder', d, t)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.doc-tree { font-size: .8125rem; }
.doc-tree-children { padding-left: 1rem; }
.doc-tree-item {
  display: flex; align-items: center; gap: .35rem;
  padding: .3rem .5rem; border-radius: 6px; cursor: pointer;
  transition: background .15s;
  color: var(--color-muted);
  position: relative;
}
.doc-tree-item:hover { background: color-mix(in srgb, var(--color-accent) 8%, transparent); color: var(--color-foreground); }
.doc-tree-item.active { background: color-mix(in srgb, var(--color-accent) 14%, transparent); color: var(--color-accent); }
.doc-tree-item.drag-over {
  background: color-mix(in srgb, var(--color-accent) 18%, transparent);
  outline: 1px dashed var(--color-accent);
  outline-offset: -1px;
}
.doc-tree-item[draggable="true"] { cursor: grab; }
.doc-tree-item[draggable="true"]:active { cursor: grabbing; }
.doc-tree-icon { flex-shrink: 0; font-size: .8125rem; }
.doc-tree-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0; }
.doc-tree-del {
  opacity: 0; flex-shrink: 0; background: none; border: none; cursor: pointer;
  font-size: .625rem; padding: .1rem .25rem; border-radius: 3px;
  color: var(--color-muted); line-height: 1;
  transition: opacity .15s, background .15s;
}
.doc-tree-item:hover .doc-tree-del { opacity: .6; }
.doc-tree-del:hover { opacity: 1 !important; background: color-mix(in srgb, #e74c3c 20%, transparent); color: #e74c3c; }
</style>
