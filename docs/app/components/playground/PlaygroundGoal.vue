<script setup lang="ts">
const percent = 80

const ring = `conic-gradient(var(--ui-primary) ${percent}%, var(--ui-bg-accented) 0)`
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-4">
    <p class="self-start font-semibold text-highlighted">
      Investment goal
    </p>

    <div class="relative size-32 rounded-full" :style="{ background: ring }">
      <div class="absolute inset-3 rounded-full bg-default flex flex-col items-center justify-center">
        <span class="text-xl font-semibold text-highlighted">$24k</span>
        <span class="text-xs text-muted">{{ percent }}% of $30k</span>
      </div>
    </div>

    <div class="flex items-center justify-between w-full text-sm">
      <span class="text-muted">Projected finish</span>
      <span class="font-medium text-highlighted">Oct 2026</span>
    </div>
  </div>
</template>
