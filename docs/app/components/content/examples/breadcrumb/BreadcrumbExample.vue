<script setup lang="ts">
const items = [{
  label: 'Home',
  icon: 'i-heroicons-home'
}, {
  icon: 'i-heroicons-cube-transparent',
  label: 'Components',
  to: '/components'
}, {
  icon: 'i-heroicons-link',
  label: 'Breadcrumb',
  to: '/components/breadcrumb'
}]
</script>

<template>
  <UBreadcrumb :items="items" />
</template>
