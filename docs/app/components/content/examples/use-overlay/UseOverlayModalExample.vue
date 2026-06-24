<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <UModal
    title="Welcome 👋"
    description="This modal was opened programmatically with useOverlay."
    :close="{ onClick: () => emit('close') }"
    :ui="{ footer: 'justify-end' }"
  >
    <template #footer>
      <UButton label="Close" color="neutral" @click="emit('close')" />
    </template>
  </UModal>
</template>
