<script setup lang="ts">
const slideover = useSlideover()

defineProps<{
  count: number
}>()
</script>

<template>
  <USlideover :description="`This slideover was opened programmatically ${count} times`">
    <template #body>
      <Placeholder class="h-full" />
    </template>

    <template #footer>
      <UButton color="neutral" label="Close" @click="slideover.close()" />
    </template>
  </USlideover>
</template>
