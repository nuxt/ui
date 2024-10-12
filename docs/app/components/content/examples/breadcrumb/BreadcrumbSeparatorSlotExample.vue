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
  <UBreadcrumb :items="items">
    <template #separator>
      <span class="mx-2 text-[var(--ui-text-muted)]">/</span>
    </template>
  </UBreadcrumb>
</template>
