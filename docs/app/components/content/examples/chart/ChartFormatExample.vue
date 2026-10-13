<script setup lang="ts">
const data = [
  { month: 'January', revenue: 18600 },
  { month: 'February', revenue: 30500 },
  { month: 'March', revenue: 23700 },
  { month: 'April', revenue: 27300 },
  { month: 'May', revenue: 20900 },
  { month: 'June', revenue: 31400 }
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' })
</script>

<template>
  <UChart
    type="bar"
    :data="data"
    index="month"
    :categories="['revenue']"
    :format="value => currency.format(value)"
    aria-label="Monthly revenue"
  />
</template>
