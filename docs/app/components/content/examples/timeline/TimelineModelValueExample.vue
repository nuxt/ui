<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'

const items: TimelineItem[] = [{
  date: 'Mar 15, 2025',
  title: 'Project Kickoff',
  description: 'Kicked off the project with team alignment. Set up project milestones and allocated resources.',
  icon: 'i-lucide-rocket',
  value: 'kickoff'
}, {
  date: 'Mar 22, 2025',
  title: 'Design Phase',
  description: 'User research and design workshops. Created wireframes and prototypes for user testing.',
  icon: 'i-lucide-palette',
  value: 'design'
}, {
  date: 'Mar 29, 2025',
  title: 'Development Sprint',
  description: 'Frontend and backend development. Implemented core features and integrated with APIs.',
  icon: 'i-lucide-code',
  value: 'development'
}, {
  date: 'Apr 5, 2025',
  title: 'Testing & Deployment',
  description: 'QA testing and performance optimization. Deployed the application to production.',
  icon: 'i-lucide-check-circle',
  value: 'deployment'
}]

const active = ref(0)

// Note: This is for demonstration purposes only. Don't do this at home.
onMounted(() => {
  setInterval(() => {
    active.value = (active.value + 1) % items.length
  }, 2000)
})
</script>

<template>
  <UTimeline v-model="active" :items="items" class="w-96" />
</template>
