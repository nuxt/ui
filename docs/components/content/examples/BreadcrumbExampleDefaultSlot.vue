<script setup lang="ts">
const links = [{
  label: 'Home',
  to: '/'
}, {
  label: 'Navigation'
}, {
  label: 'Breadcrumb'
}]
</script>

<template>
  <UBreadcrumb :links="links">
    <template #default="{ link, isActive, index }">
      <UBadge :color="isActive ? 'primary' : 'gray'" class="rounded-full truncate">
        {{ index + 1 }}. {{ link.label }}
      </UBadge>
    </template>
  </UBreadcrumb>
</template>
