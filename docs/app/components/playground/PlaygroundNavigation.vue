<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const appConfig = useAppConfig()
const extra = useStudioExtraIcons()

const items: NavigationMenuItem[][] = [
  [
    { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', active: true },
    { label: 'Inbox', icon: extra.inbox, badge: '4' },
    { label: 'Projects', icon: appConfig.ui.icons.folder },
    { label: 'Calendar', icon: extra.calendar }
  ],
  [
    { label: 'Settings', icon: extra.settings },
    { label: 'Help', icon: appConfig.ui.icons.info }
  ]
]
</script>

<template>
  <div class="p-2">
    <UNavigationMenu orientation="vertical" :items="items" class="w-full" />
  </div>
</template>
