<template>
  <UFeed :feed="feed">
    <template #trailing="{ item }">
      <div v-if="item.trailing" class="mt-1.5 font-mono text-xs text-gray-500 flex items-center justify-end gap-2">
        {{ item.trailing }} <UIcon name="i-heroicons-clock" />
      </div>
    </template>
  </UFeed>
</template>

<script setup>
const feed = [
  { title: 'Device turned on' },
  { title: 'OS boot', trailing: '3s' },
  { title: 'OS drivers load', trailing: '12s' },
  { title: 'OS ready', trailing: '13s' },
  { title: 'User profile loaded', trailing: '5s' }
]
</script>
