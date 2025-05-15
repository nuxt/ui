<script lang="ts" setup>
const items = [
  {
    title: 'Backlog',
    content: 'This is the backlog panel.'
  },
  {
    title: 'Todo',
    content: 'This is the todo panel.'
  },
  {
    title: 'In Progress',
    content: 'This is the in progress panel.'
  },
  {
    title: 'Done',
    content: 'This is the done panel.'
  }
]
</script>

<template>
  <div>
    <UTimeline :items="items" />
  </div>
</template>
