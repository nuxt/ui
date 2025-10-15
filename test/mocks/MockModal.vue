<template>
  <div class="mock-modal">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <button
      class="close"
      @click="$emit('close', 'test-result')"
    >
      Close
    </button>
    <button
      type="button"
      class="submit"
      @click="$emit('submit', 42)"
    >
      Submit
    </button>
  </div>
</template>

<script setup lang="ts">
const { title = 'Test Modal', description = 'Test Description' } = defineProps<{
  title?: string
  description?: string
}>()

defineEmits<{
  refresh: [ids: number[]]
  submit: [id: number]
  close: [value: string]
}>()
</script>
