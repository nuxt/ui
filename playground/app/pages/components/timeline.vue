<script lang="ts" setup>
import type { TimelineItem } from '@nuxt/ui'
import theme from '#build/ui/timeline'

const sizes = Object.keys(theme.variants.size)
const colors = Object.keys(theme.variants.color)
const orientations = Object.keys(theme.variants.orientation)

const orientation = ref('vertical' as const)
const color = ref('primary' as const)
const size = ref('md' as const)

const items = [{
  date: 'Mar 15, 2025',
  title: 'Project Kickoff',
  description: 'Kicked off the project with team alignment. Set up project milestones and allocated resources.',
  icon: 'i-lucide-rocket',
  value: 'kickoff'
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
}] satisfies TimelineItem[]

const value = ref('kickoff')
</script>

<template>
  <div class="flex flex-col gap-10">
    <div class="flex items-center justify-center gap-2">
      <USelect v-model="color" :items="colors" placeholder="Color" />
      <USelect v-model="orientation" :items="orientations" placeholder="Orientation" />
      <USelect v-model="size" :items="sizes" placeholder="Size" />
      <USelect v-model="value" :items="items.map(item => item.value)" placeholder="Value" />
    </div>

    <UTimeline
      v-model="value"
      :color="color"
      :orientation="orientation"
      :size="size"
      :items="items"
      class="data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-96"
    />
  </div>
</template>
