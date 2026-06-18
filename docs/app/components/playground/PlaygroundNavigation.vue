<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[][] = [
  [
    { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', active: true },
    { label: 'Inbox', icon: 'i-lucide-inbox', badge: '4' },
    { label: 'Projects', icon: 'i-lucide-folder' },
    { label: 'Calendar', icon: 'i-lucide-calendar' }
  ],
  [
    { label: 'Settings', icon: 'i-lucide-settings' },
    { label: 'Help', icon: 'i-lucide-circle-help' }
  ]
]
</script>

<template>
  <div class="p-2">
    <UNavigationMenu orientation="vertical" :items="items" class="w-full" />
  </div>
</template>
