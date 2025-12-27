<script setup lang="ts">
const items = [
  { icon: 'i-lucide-users', title: 'Users', value: '12,345', trend: 12.5, trendDirection: 'up' as const },
  { icon: 'i-lucide-shopping-cart', title: 'Sales', value: '$45,231', trend: 8.2, trendDirection: 'down' as const },
  { icon: 'i-lucide-dollar-sign', title: 'Revenue', value: '$125,430' },
  { icon: 'i-lucide-activity', title: 'Sessions', value: '1,234', trend: 15.3, trendDirection: 'up' as const }
]
</script>

<template>
  <UStatGroup :cols="4">
    <UStatCard
      v-for="item in items"
      :key="item.title"
      :icon="item.icon"
      :title="item.title"
      :value="item.value"
      :trend="item.trend"
      :trend-direction="item.trendDirection"
    />
  </UStatGroup>
</template>
