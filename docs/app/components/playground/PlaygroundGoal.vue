<script setup lang="ts">
const invested = 24000
const goal = 30000

const data = [
  { label: 'Invested', amount: invested },
  { label: 'Remaining', amount: goal - invested }
]
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-4">
    <p class="self-start font-semibold text-highlighted">
      Investment goal
    </p>

    <UChart
      type="donut"
      :data="data"
      index="label"
      :categories="['amount']"
      :colors="['primary', 'var(--ui-bg-accented)']"
      :thickness="12"
      :height="128"
      :initial-width="128"
      aria-label="Investment goal progress"
      class="w-32"
    >
      <template #center>
        <span class="text-xl font-semibold text-highlighted">$24k</span>
        <span class="text-xs text-muted">{{ Math.round(invested / goal * 100) }}% of $30k</span>
      </template>
    </UChart>

    <div class="flex items-center justify-between w-full text-sm">
      <span class="text-muted">Projected finish</span>
      <span class="font-medium text-highlighted">Oct 2026</span>
    </div>
  </div>
</template>
