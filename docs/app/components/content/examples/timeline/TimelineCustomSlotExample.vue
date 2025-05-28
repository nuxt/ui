<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'

const items: TimelineItem[] = [{
  date: 'Mar 15, 2025',
  title: 'Project Kickoff',
  subtitle: 'Project Initiation',
  description: 'Kicked off the project with team alignment. Set up project milestones and allocated resources.',
  icon: 'i-lucide-rocket',
  value: 'kickoff',
  slot: 'kickoff' as const
}, {
  date: 'Mar 22, 2025',
  title: 'Design Phase',
  description: 'User research and design workshops. Created wireframes and prototypes for user testing',
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
</script>

<template>
  <UTimeline :items="items" class="w-full">
    <template #kickoff-title="{ item }">
        <div class="flex items-center">
            <span>{{ item.title }}</span>
            <span class="text-xs text-neutral">{{ item.subtitle }}</span>

        </div>
    </template>
  </UTimeline>
</template>
