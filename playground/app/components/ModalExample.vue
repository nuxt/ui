<script setup lang="ts">
const modal = useModal()

defineProps<{
  count: number
}>()
</script>

<template>
  <UModal :title="`This modal was opened programmatically ${count} times`">
    <template #footer>
      <UButton color="gray" label="Close" @click="modal.close()" />
    </template>
  </UModal>
</template>
