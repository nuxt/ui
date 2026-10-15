<script setup lang="ts">
const data = [
  { month: 'January', revenue: 18600, expenses: 12400 },
  { month: 'February', revenue: 30500, expenses: 21800 },
  { month: 'March', revenue: 23700, expenses: 25100 },
  { month: 'April', revenue: 27300, expenses: 19600 },
  { month: 'May', revenue: 20900, expenses: 22300 },
  { month: 'June', revenue: 31400, expenses: 20700 }
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function profit(month?: string) {
  const row = data.find(row => row.month === month)

  return row ? row.revenue - row.expenses : 0
}
</script>

<template>
  <UChart
    type="bar"
    :data="data"
    index="month"
    :categories="[{ key: 'revenue', label: 'Revenue', color: 'success' }, { key: 'expenses', label: 'Expenses', color: 'error' }]"
    :format="value => currency.format(value)"
    aria-label="Revenue and expenses"
  >
    <template #tooltip="{ title, rows }">
      <p class="font-medium text-strong">
        {{ title }}
      </p>

      <div v-for="row in rows" :key="row.label" class="flex items-center gap-2">
        <span class="size-2 rounded-full" :style="{ backgroundColor: row.color }" />
        <span class="text-muted">{{ row.label }}</span>
        <span class="ms-auto ps-4 tabular-nums">{{ row.value }}</span>
      </div>

      <USeparator class="my-1" />

      <div class="flex items-center gap-2">
        <span class="text-muted">Profit</span>
        <UBadge
          :color="profit(title) >= 0 ? 'success' : 'error'"
          :label="currency.format(profit(title))"
          variant="subtle"
          size="sm"
          class="ms-auto tabular-nums"
        />
      </div>
    </template>
  </UChart>
</template>
