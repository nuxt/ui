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
interface Props {
  title?: string
  description?: string
  open?: boolean
}

interface Emits {
  close: [value: string]
}

withDefaults(defineProps<Props>(), {
  title: 'Test Modal',
  description: 'Test Description',
  open: false
})

defineEmits<Emits>()
</script>

<style scoped>
.mock-modal {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  background: white;
}

.mock-modal h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: bold;
}

.mock-modal p {
  margin: 0 0 1rem 0;
  color: #666;
}

.mock-modal button {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.mock-modal button:hover {
  background: #0056b3;
}
</style>
