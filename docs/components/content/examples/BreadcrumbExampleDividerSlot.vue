<script setup lang="ts">
const items = [{
  text: 'Documentation',
  icon: 'i-heroicons-home',
  to: '/getting-started'
}, {
  text: 'Navigation',
  to: '/getting-started'
}, {
  text: 'Breadcrumb',
  to: '/navigation/breadcrumb'
}]
</script>

<template>
  <UBreadcrumb :items="items">
    <template #divider>
      <span class="w-1 h-1 rounded-full bg-gray-200" />
      <span class="w-8 h-1 rounded-full bg-gray-300" />
      <span class="w-1 h-1 rounded-full bg-gray-200" />
    </template>
  </UBreadcrumb>
</template>
