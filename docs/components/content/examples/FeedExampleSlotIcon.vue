<template>
  <UFeed :feed="feed">
    <template #icon="{ item }">
      <div class="px-2 py-0.5 font-sm font-mono rounded-full bg-gray-200 dark:bg-gray-700 flex items-center gap-2">
        <UIcon name="i-heroicons-clock" />
        {{ item.time }}
      </div>
    </template>
  </UFeed>
</template>

<script setup>
const feed = [
  { title: 'Task started', time: '20:30' },
  { title: 'Task finished', time: '20:34' }
]
</script>
