<script setup lang="ts">
const data = [
  { browser: 'Chrome', visitors: 275 },
  { browser: 'Safari', visitors: 200 },
  { browser: 'Firefox', visitors: 187 },
  { browser: 'Edge', visitors: 173 }
]
</script>

<template>
  <UChart
    type="donut"
    :data="data"
    index="browser"
    :categories="['visitors']"
    legend
    aria-label="Visitors by browser"
  >
    <template #center>
      <span class="text-2xl font-semibold text-highlighted">835</span>
      <span class="text-xs text-muted">Visitors</span>
    </template>
  </UChart>
</template>
