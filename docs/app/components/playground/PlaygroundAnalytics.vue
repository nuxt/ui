<script setup lang="ts">
const studioIcons = useStudioIcons()
const bars = [40, 65, 52, 80, 60, 95, 72]
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
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

    <div>
      <div class="flex items-end gap-1.5 h-24">
        <div
          v-for="(bar, index) in bars"
          :key="index"
          class="flex-1 rounded-t-sm bg-primary/80 transition-colors hover:bg-primary"
          :style="{ height: `${bar}%` }"
        />
      </div>
      <div class="flex gap-1.5 mt-1.5">
        <span v-for="(day, index) in days" :key="index" class="flex-1 text-center text-xs text-muted">
          {{ day }}
        </span>
      </div>
    </div>
  </div>
</template>
