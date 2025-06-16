<script setup lang="ts">
const emit = defineEmits(['close'])
</script>

<template>
  <UModal title="Second modal" description="This is the second modal opened from the button.">
    <template #footer>
      <UButton color="neutral" label="Close" @click="emit('close')" />
    </template>
  </UModal>
</template>
