<script setup lang="ts">
const props = defineProps<{
  content: string
  title: string
}>()
const emit = defineEmits<{
  update: [content: string]
  save: []
}>()

const localContent = ref(props.content)
watch(() => props.content, (v) => { localContent.value = v })
watch(localContent, (v) => { emit('update', v) })
</script>

<template>
  <div class="doc-editor">
    <textarea
      v-model="localContent"
      class="doc-editor-textarea"
      placeholder="Start writing markdown..."
    />
  </div>
</template>

<style scoped>
.doc-editor { display: flex; flex-direction: column; height: 100%; }
.doc-editor-textarea {
  flex: 1; width: 100%; padding: 1.25rem;
  background: transparent; border: none; outline: none; resize: none;
  font-family: 'Fira Code', monospace; font-size: .875rem; line-height: 1.7;
  color: var(--color-foreground);
}
.doc-editor-textarea::placeholder { color: var(--color-muted); opacity: .5; }
</style>
