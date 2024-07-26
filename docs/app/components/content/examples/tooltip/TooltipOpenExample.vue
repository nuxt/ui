<script setup lang="ts">
const open = ref(true)

// Note: This is for demonstration purposes only. Don't do this at home.
onMounted(() => {
  setInterval(() => {
    open.value = !open.value
  }, 1000)
})
</script>

<template>
  <UTooltip v-model:open="open" text="Open on GitHub">
    <UButton icon="i-simple-icons-github" />
  </UTooltip>
</template>
