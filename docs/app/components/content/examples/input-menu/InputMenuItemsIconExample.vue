<script setup lang="ts">
const items = ref([
  {
    label: 'Backlog',
    value: 'backlog',
    icon: 'i-heroicons-question-mark-circle'
  },
  {
    label: 'Todo',
    value: 'todo',
    icon: 'i-heroicons-plus-circle'
  },
  {
    label: 'In Progress',
    value: 'in_progress',
    icon: 'i-heroicons-arrow-up-circle'
  },
  {
    label: 'Done',
    value: 'done',
    icon: 'i-heroicons-check-circle'
  }
])
const value = ref(items.value[0])
</script>

<template>
  <UInputMenu v-model="value" :icon="value?.icon" :items="items" />
</template>
