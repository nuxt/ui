<script setup lang="ts">
const studioIcons = useStudioIcons()
const data = [
  { day: 'Mon', visitors: 40 },
  { day: 'Tue', visitors: 65 },
  { day: 'Wed', visitors: 52 },
  { day: 'Thu', visitors: 80 },
  { day: 'Fri', visitors: 60 },
  { day: 'Sat', visitors: 95 },
  { day: 'Sun', visitors: 72 }
]
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm text-muted">
          Visitors
        </p>
        <p class="text-2xl font-semibold text-highlighted">
          418.2K
        </p>
      </div>
      <UBadge color="success" variant="subtle" size="sm" :icon="studioIcons.trendingUp">
        +10%
      </UBadge>
    </div>

    <UChart
      type="bar"
      :data="data"
      index="day"
      :categories="['visitors']"
      :grid="false"
      :y-axis="false"
      :height="120"
      :initial-width="280"
      aria-label="Visitors per day"
    />
  </div>
</template>
