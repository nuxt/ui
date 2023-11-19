<template>
  <UList class="w-64" orientation="horizontal" wrap gap>
    <div
      v-for="(item, key) in items"
      :key="key"
      class="w-30 rounded bg-gray-200 dark:bg-gray-800 px-2 flex items-center gap-2"
    >
      <UIcon :name="item.icon" /> {{ item.label }}
    </div>
  </UList>
</template>

<script setup>
const items = [
  { label: 'Home', icon: 'i-heroicons-home' },
  { label: 'Users', icon: 'i-heroicons-users' },
  { label: 'Carts', icon: 'i-heroicons-shopping-bag' },
  { label: 'Shipments', icon: 'i-heroicons-truck' }
]
</script>
