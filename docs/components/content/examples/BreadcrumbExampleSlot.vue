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
    <template #item="{ item, isActive, index }">
      <UBadge :color="isActive ? 'primary' : 'gray'" variant="outline" :class="{ 'ms-2': index === 0 }" :ui="{ rounded: 'rounded-full' }">
        {{ index + 1 }}. {{ item.text }}
      </UBadge>
    </template>
  </UBreadcrumb>
</template>
