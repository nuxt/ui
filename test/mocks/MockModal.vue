<template>
  <div class="mock-modal">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <button
      @click="$emit('close', 'test-result')"
    >
      Close
    </button>
  </div>
</template>

<script setup lang="ts">
const { title = 'Test Modal', description = 'Test Description' } = defineProps<{
  title?: string
  description?: string
}>()

defineEmits<{
  close: [value: string]
}>()
</script>
