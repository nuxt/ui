<script setup lang="ts">
const input = useTemplateRef('input')

defineShortcuts({
  '/': () => {
    input.value?.inputRef?.focus()
  }
})
</script>

<template>
  <UInput
    ref="input"
    icon="i-lucide-search"
    placeholder="Search..."
  >
    <template #trailing>
      <UKbd value="/" />
    </template>
  </UInput>
</template>
