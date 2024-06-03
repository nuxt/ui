<script setup lang="ts">
const items = [{
  label: 'Tab1',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  },
  content: 'This is the content shown for Tab1'
}, {
  label: 'Tab2',
  icon: 'i-heroicons-user',
  content: 'And, this is the content for Tab2'
}, {
  label: 'Tab3',
  icon: 'i-heroicons-bell',
  content: 'Finally, this is the content for Tab3',
  slot: 'custom' as const
}]
</script>

<template>
  <div class="flex gap-4">
    <UTabs :items="[{ label: 'Monthly' }, { label: 'Yearly' }]" :content="false" />

    <UTabs :items="items" class="w-96">
      <template #custom="{ item }">
        <span class="text-gray-500 dark:text-gray-400">Custom: {{ item.content }}</span>
      </template>
    </UTabs>

    <UTabs :items="items" orientation="vertical" />
  </div>
</template>
