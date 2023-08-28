<template>
  <UList :items="items" />
</template>

<script setup>
const items = [
  {
    label: 'Store',
    icon: 'i-heroicons-building-storefront'
  },
  {
    label: 'Clients',
    icon: 'i-heroicons-user-group'
  },
  {
    label: 'Products',
    icon: 'i-heroicons-gift'
  },
  {
    label: 'Warehouses',
    icon: 'i-heroicons-home-modern'
  },
  {
    label: 'Inventory',
    icon: 'i-heroicons-gift-top'
  },
]
</script>
