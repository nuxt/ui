<script setup>
const links = [{
  label: 'Documentation',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Navigation',
  icon: 'i-heroicons-square-3-stack-3d',
  to: '/navigation'
}, {
  label: 'Breadcrumb',
  icon: 'i-heroicons-link',
  to: '/navigation/breadcrumb'
}]
</script>

<template>
  <UBreadcrumb :links="links" />
</template>
