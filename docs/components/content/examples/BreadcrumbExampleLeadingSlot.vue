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
  <UBreadcrumb :items="items" :divider="null">
    <template #leading="{ index, isActive }">
      <UAvatar
        :alt="(index + 1 ).toString()"
        :ui="{ background: isActive ? 'bg-primary-100 dark:bg-primary-800 border border-primary' : 'bg-gray-100 dark:bg-gray-800 border' }"
        size="xs"
      />
      <span class="w-8 h-1 rounded-full me-2" :class="[isActive ? 'bg-primary-100' : 'bg-gray-100']" />
    </template>
  </UBreadcrumb>
</template>
