<script lang="ts" setup>
const modal = useModal()

defineProps<{
  count: number
}>()
</script>

<template>
  <UModal title="This modal was opened programmatically">
    <template #footer>
      <div class="flex w-full justify-between">
        <p>Count: {{ count }}</p>
        <UButton color="gray" label="Close" @click="modal.close()" />
      </div>
    </template>
  </UModal>
</template>
