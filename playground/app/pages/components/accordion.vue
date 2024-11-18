<script setup lang="ts">
const items = [{
  label: 'Getting Started',
  icon: 'i-lucide-info',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Installation',
  icon: 'i-lucide-download',
  disabled: true,
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Theming',
  icon: 'i-lucide-pipette',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Layouts',
  icon: 'i-lucide-layout-dashboard',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Components',
  icon: 'i-lucide-layers-3',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Utilities',
  slot: 'custom' as const,
  icon: 'i-lucide-wrench',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}]
</script>

<template>
  <UCard :ui="{ body: 'p-0 sm:p-0' }">
    <UAccordion :items="items" class="w-96" :ui="{ trigger: 'px-3.5', body: 'px-3.5' }">
      <template #body="{ item }">
        <p class="text-[var(--ui-text-muted)]">
          {{ item.content }}
        </p>
      </template>

      <template #custom-body="{ item }">
        <p class="text-[var(--ui-text-muted)]">
          Custom: {{ item.content }}
        </p>
      </template>
    </UAccordion>
  </UCard>
</template>
