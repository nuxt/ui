<script lang="ts" setup>
const items = [
  {
    title: 'Backlog',
    description: 'This is the backlog panel.',
    icon: 'i-lucide-smile'
  },
  {
    title: 'Todo',
    description: 'This is the todo panel.'
  },
  {
    title: 'In Progress',
    description: 'This is the in progress panel.'
  },
  {
    title: 'Done',
    description: 'This is the done panel.'
  }
]
</script>

<template>
  <div>
    <UTimeline :model-value="2" :items="items" />
  </div>
</template>
