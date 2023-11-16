<script setup>
const links = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Navigation',
  icon: 'i-heroicons-square-3-stack-3d'
}, {
  label: 'Breadcrumb',
  icon: 'i-heroicons-link',
  to: '/navigation/breadcrumb'
}]
</script>

<template>
  <UBreadcrumb :links="links" :ui="{ container: 'gap-x-3' }">
    <template #divider>
      <span class="w-8 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
    </template>
  </UBreadcrumb>
</template>
