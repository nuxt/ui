<template>
  <UList :items="items" />
</template>

<script setup>
const items = [
  {
    label: 'Store',
    icon: 'i-heroicons-building-storefront',
    color: 'blue',
    variant: 'solid',
    to: '#store'
  },
  {
    label: 'Clients',
    icon: 'i-heroicons-user-group',
    color: 'cyan',
    to: '#clients'
  },
  {
    label: 'Products',
    icon: 'i-heroicons-gift',
    color: 'green',
    to: '#products'
  },
  {
    label: 'Warehouses',
    icon: 'i-heroicons-home-modern',
    color: 'lime',
    to: '#warehouses'
  },
  {
    label: 'Inventory',
    icon: 'i-heroicons-gift-top',
    color: 'yellow',
    to: '#inventory'
  },
]
</script>
