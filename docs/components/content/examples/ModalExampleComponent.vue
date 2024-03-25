<script lang="ts" setup>
defineProps({
  count: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <UModal>
    <UCard>
      <p>This modal was opened programmatically !</p>
      <p>Count: {{ count }}</p>
    </UCard>
  </UModal>
</template>
