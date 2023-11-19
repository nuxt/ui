<template>
  <UFeed :feed="feed" :indicators="false">
    <template #title="{ item }">
      <div class="h-full flex items-center" :class="`text-${item.color}-500`">
        {{ item.title }}
      </div>
    </template>
  </UFeed>
</template>

<script setup>
const feed = [
  {
    title: 'Package on delivery',
    color: 'green',
    icon: 'i-heroicons-truck'
  },
  {
    title: 'Packaged failed to deliver!',
    description: 'Call us to re-deliver your package, or pick it up at our store',
    color: 'red',
    icon: 'i-heroicons-x-mark'
  }
]
</script>
