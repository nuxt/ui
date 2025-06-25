<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'

const items: TimelineItem[] = [{
  date: 'Mar 15, 2025',
  title: 'Project Kickoff',
  icon: 'i-lucide-rocket',
  value: 'kickoff'
}, {
  date: 'Mar 22, 2025',
  title: 'Design Phase',
  icon: 'i-lucide-palette',
  value: 'design'
}, {
  date: 'Mar 29, 2025',
  title: 'Development Sprint',
  icon: 'i-lucide-code',
  value: 'development'
}, {
  date: 'Apr 5, 2025',
  title: 'Testing & Deployment',
  icon: 'i-lucide-check-circle',
  value: 'deployment'
}]
</script>

<template>
  <UTimeline
    :items="items"
    :ui="{ item: 'even:flex-row-reverse even:-translate-x-[calc(100%-2rem)] even:text-right' }"
    :default-value="2"
    class="translate-x-[calc(50%-1rem)]"
  />
</template>
