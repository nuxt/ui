<script setup lang="ts">
const items = [
  { icon: 'i-lucide-users', title: 'Users', value: '12,345' },
  { icon: 'i-lucide-shopping-cart', title: 'Sales', value: '$45,231' }
]
</script>

<template>
  <UStatGroup :cols="2" gap="lg">
    <UStatCard
      v-for="item in items"
      :key="item.title"
      :icon="item.icon"
      :title="item.title"
      :value="item.value"
    />
  </UStatGroup>
</template>
