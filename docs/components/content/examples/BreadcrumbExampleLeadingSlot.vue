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
      <UBadge :color="isActive ? 'primary' : 'gray'" :ui="{ rounded: 'rounded-full' }">
        {{ index + 1 }}
      </UBadge>
      <span class="w-5 h-1 rounded-full me-2" :class="{ 'bg-primary-400': isActive, 'bg-gray-400': !isActive }" />
    </template>
  </UBreadcrumb>
</template>
