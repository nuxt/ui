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
    <template #tooltip="{ points }">
      <p class="font-medium text-highlighted mb-1">
        {{ points[0]?.datum.x }}
      </p>

      <div v-for="point in points" :key="point.key" class="flex items-center gap-2">
        <span class="size-2 rounded-full" :style="{ backgroundColor: point.color }" />
        <span class="capitalize text-muted">{{ point.datum.category }}</span>
        <span class="ms-auto font-medium text-highlighted tabular-nums">{{ point.datum.value }}</span>
      </div>
    </template>
  </UChart>
</template>
