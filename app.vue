<script setup lang="ts">
const theme = useTheme()
const loaded = ref(false)

onMounted(() => {
  theme.loadPrefs()
  loaded.value = true
})
</script>

<template>
  <LoadingScreen v-if="!loaded" />
  <NuxtLayout v-else>
    <NuxtPage />
  </NuxtLayout>
</template>
