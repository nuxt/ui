<script lang="ts" setup>

defineProps({
  count: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <USlideover>
    <UCard>
      <p>This slideover was opened programmatically !</p>
      <p>Count: {{ count }}</p>
    </UCard>
  </USlideover>
</template>