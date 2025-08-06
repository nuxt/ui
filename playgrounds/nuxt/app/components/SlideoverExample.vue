<script setup lang="ts">
defineProps<{
  count: number
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <USlideover :description="`This slideover was opened programmatically ${count} times`">
    <template #body>
      <Placeholder class="h-full" />
    </template>

    <template #footer>
      <UButton color="neutral" label="Close" @click="emit('close')" />
    </template>
  </USlideover>
</template>
