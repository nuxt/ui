<script setup lang="ts">
defineProps<{
  count: number
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <UModal :title="`This modal was opened programmatically ${count} times`">
    <template #footer>
      <UButton color="neutral" label="Close" @click="emit('close')" />
    </template>
  </UModal>
</template>
