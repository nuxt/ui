<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const items: TabsItem[] = [
  { label: 'Overview', icon: 'i-lucide-layout-dashboard', content: 'Overview content' },
  { label: 'Activity', icon: 'i-lucide-activity', content: 'Activity content' },
  { label: 'Settings', icon: 'i-lucide-settings', content: 'Settings content' },
  { label: 'Members', icon: 'i-lucide-users', content: 'Members content' },
  { label: 'Billing', icon: 'i-lucide-credit-card', content: 'Billing content' },
  { label: 'Integrations', icon: 'i-lucide-plug', content: 'Integrations content' },
  { label: 'Notifications', icon: 'i-lucide-bell', content: 'Notifications content' },
  { label: 'Security', icon: 'i-lucide-shield', content: 'Security content' }
]
</script>

<template>
  <UTabs
    overflow="collapse"
    :items="items"
    class="w-96"
  />
</template>
