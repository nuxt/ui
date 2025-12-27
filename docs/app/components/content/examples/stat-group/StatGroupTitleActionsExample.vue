<script setup lang="ts">
const items = [
  { icon: 'i-lucide-users', title: 'Users', value: '12,345' },
  { icon: 'i-lucide-shopping-cart', title: 'Sales', value: '$45,231' }
]
</script>

<template>
  <UStatGroup title="Dashboard Overview" :cols="2">
    <template #actions>
      <UButton size="xs" variant="ghost">
        Last 30 days
      </UButton>
    </template>
    <UStatCard
      v-for="item in items"
      :key="item.title"
      :icon="item.icon"
      :title="item.title"
      :value="item.value"
    />
  </UStatGroup>
</template>
