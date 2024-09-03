<script setup lang="ts">
const selected = ref('backlog')
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

const icon = computed(() => items.value.find(item => item.value === selected.value)?.icon)
</script>

<template>
  <USelect v-model="selected" :icon="icon" :items="items" class="w-40" />
</template>
