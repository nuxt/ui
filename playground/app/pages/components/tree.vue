<script setup lang="ts">
const items = ref([
  {
    label: 'Backlog',
    value: 'backlog',
    icon: 'i-lucide-circle-help',
    children: [
      {
        label: 'Backlog 1',
        value: 'backlog-1',
        icon: 'i-lucide-circle-help'
      },
      {
        label: 'Backlog 2',
        value: 'backlog-2',
        icon: 'i-lucide-circle-help'
      }
    ]
  },
  {
    label: 'Todo',
    value: 'todo',
    icon: 'i-lucide-circle-plus'
  },
  {
    label: 'In Progress',
    value: 'in_progress',
    icon: 'i-lucide-circle-arrow-up'
  },
  {
    label: 'Done',
    value: 'done',
    icon: 'i-lucide-circle-check'
  }
])
</script>

<template>
  <div>
    <UTree :items="items" :get-key="(item) => item.label" />
  </div>
</template>
