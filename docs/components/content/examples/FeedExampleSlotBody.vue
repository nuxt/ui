<template>
  <UFeed :feed="feed" :indicators="false">
    <template #body="{ item }">
      <div class="space-y-2">
        <div class="text-xl">
          {{ item.title }}
        </div>
        <div class="px-3 py-2 text-gray-100 text-sm font-mono ring-1 ring-gray-800 rounded bg-gray-950 shadow">
          &gt; {{ item.description }}
        </div>
      </div>
    </template>
  </UFeed>
</template>

<script setup>
const feed = [
  { title: 'Process started', description: 'transcode --file=/storage/cf423da1.mp4' },
  { title: 'Process finished', description: 'cf423da1.mp4 transcode successful' }
]
</script>
