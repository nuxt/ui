<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'

const items = [{
  date: 'Mar 15, 2025',
  title: 'Project Kickoff',
  subtitle: 'Project Initiation',
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
  value: 'development',
  slot: 'development' as const,
  developers: [
    {
      src: 'https://github.com/J-Michalek.png'
    }, {
      src: 'https://github.com/benjamincanac.png'
    }
  ]
}, {
  date: 'Apr 5, 2025',
  title: 'Testing & Deployment',
  description: 'QA testing and performance optimization. Deployed the application to production.',
  icon: 'i-lucide-check-circle',
  value: 'deployment'
}] satisfies TimelineItem[]
</script>

<template>
  <UTimeline :items="items" :default-value="2" class="w-96">
    <template #development-title="{ item }">
      <div class="flex items-center gap-1">
        <span>{{ item.title }}</span>

        <UAvatarGroup size="2xs">
          <UAvatar v-for="(developer, index) of item.developers" :key="index" v-bind="developer" />
        </UAvatarGroup>
      </div>
    </template>
  </UTimeline>
</template>
