<script setup lang="ts">
const items = [{
  label: 'Home',
  to: '/'
}, {
  label: 'Components',
  to: '/components'
}, {
  label: 'Breadcrumb',
  to: '/components/breadcrumb'
}]
</script>

<template>
  <UBreadcrumb :items="items" separator-icon="i-heroicons-arrow-right-20-solid" />
</template>
