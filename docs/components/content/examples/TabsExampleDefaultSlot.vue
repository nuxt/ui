<script setup lang="ts">
const items = [{
  label: 'Getting Started',
  icon: 'i-heroicons-information-circle',
  content: 'This is the content shown for Tab1'
}, {
  label: 'Installation',
  icon: 'i-heroicons-arrow-down-tray',
  content: 'And, this is the content for Tab2'
}, {
  label: 'Theming',
  icon: 'i-heroicons-eye-dropper',
  content: 'Finally, this is the content for Tab3'
}]
</script>

<template>
  <UTabs :items="items" class="w-full">
    <template #default="{ item, index, selected }">
      <span class="truncate" :class="[selected && 'text-primary-500 dark:text-primary-400']">{{ index + 1 }}. {{ item.label }}</span>
    </template>
  </UTabs>
</template>
