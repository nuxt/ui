<script setup lang="ts">
const items = [{
  label: 'Getting Started',
  icon: 'i-heroicons-information-circle',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Installation',
  icon: 'i-heroicons-arrow-down-tray',
  disabled: true,
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Theming',
  icon: 'i-heroicons-eye-dropper',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Layouts',
  icon: 'i-heroicons-rectangle-group',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Components',
  icon: 'i-heroicons-square-3-stack-3d',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Utilities',
  slot: 'custom' as const,
  icon: 'i-heroicons-wrench-screwdriver',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}]
</script>

<template>
  <UCard :ui="{ body: 'p-0 sm:p-0' }">
    <UAccordion :items="items" class="w-96" :ui="{ trigger: 'px-3.5', content: 'px-3.5' }">
      <template #custom="{ item }">
        <span class="text-gray-500 dark:text-gray-400">Custom: {{ item.content }}</span>
      </template>
    </UAccordion>
  </UCard>
</template>
