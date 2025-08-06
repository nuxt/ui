<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[][] = [[{
  label: 'General',
  icon: 'i-lucide-user',
  active: true
}, {
  label: 'Members',
  icon: 'i-lucide-users'
}, {
  label: 'Notifications',
  icon: 'i-lucide-bell'
}], [{
  label: 'Documentation',
  icon: 'i-lucide-book-open',
  to: 'https://ui.nuxt.com/getting-started/installation/pro/nuxt',
  target: '_blank'
}, {
  label: 'Buy now',
  icon: 'i-lucide-shopping-cart',
  to: 'https://ui.nuxt.com/pro/purchase',
  target: '_blank'
}]]
</script>

<template>
  <UDashboardToolbar>
    <UNavigationMenu :items="items" highlight class="flex-1" />
  </UDashboardToolbar>
</template>
