<script setup lang="ts">
const items = [{
  text: 'Documentation',
  icon: 'i-heroicons-information-circle',
  to: '/getting-started'
}, {
  text: 'Installation',
  icon: 'i-heroicons-arrow-down-tray',
  to: '/getting-started/installation'
}, {
  text: 'Navigation',
  icon: 'i-heroicons-bars-3',
  disabled: true
}, {
  text: 'Breadcrumb',
  icon: 'i-heroicons-link',
  to: '/navigation/breadcrumb'
}]
</script>

<template>
  <UBreadcrumb :items="items" />
</template>
