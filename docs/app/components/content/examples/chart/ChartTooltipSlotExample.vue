<script setup lang="ts">
const data = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 }
]
</script>

<template>
  <UChart
    :data="data"
    index="month"
    :categories="['desktop', 'mobile']"
    curve="monotone"
    aria-label="Visitors by device"
  >
    <template #tooltip="{ title, rows }">
      <p class="font-medium text-highlighted">
        {{ title }}
      </p>

      <div v-for="row in rows" :key="row.label" class="flex items-center gap-2">
        <span class="size-2 rounded-full" :style="{ backgroundColor: row.color }" />
        <span class="capitalize text-muted">{{ row.label }}</span>
        <span class="ms-auto font-medium tabular-nums">{{ row.value }} visitors</span>
      </div>
    </template>
  </UChart>
</template>
