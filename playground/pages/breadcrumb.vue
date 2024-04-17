<script setup lang="ts">
const items = [{
  label: 'Home',
  to: '/'
}, {
  slot: 'dropdown',
  icon: 'i-heroicons-ellipsis-horizontal',
  children: [{
    label: 'Documentation'
  }, {
    label: 'Themes'
  }, {
    label: 'GitHub'
  }]
}, {
  label: 'Components',
  disabled: true
}, {
  label: 'Breadcrumb'
}]
</script>

<template>
  <UBreadcrumb :items="items">
    <template #dropdown="{ item }">
      <UDropdownMenu :items="item.children">
        <UButton :icon="item.icon" color="gray" variant="link" class="p-0" />
      </UDropdownMenu>
    </template>
  </UBreadcrumb>
</template>
