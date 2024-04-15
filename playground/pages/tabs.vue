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
  content: 'Finally, this is the content for Tab3'
}]
</script>

<template>
  <div class="flex flex-col gap-4">
    <UTabs :items="items" class="w-96" />
    <UTabs :items="items" orientation="vertical" />
  </div>
</template>
