<script setup lang="ts">
const links = [{
  label: 'Home',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  },
  to: '/'
}, {
  label: 'Navigation',
  icon: 'i-heroicons-square-3-stack-3d',
  disabled: true
}, {
  label: 'Breadcrumb',
  icon: 'i-heroicons-link'
}]
</script>

<template>
  <UBreadcrumb :links="links" />
</template>
