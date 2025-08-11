<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  mode: 'drawer' | 'slideover' | 'modal'
}>()

const items: NavigationMenuItem[] = [{
  label: 'Home',
  icon: 'i-lucide-house',
  active: true
}, {
  label: 'Inbox',
  icon: 'i-lucide-inbox'
}, {
  label: 'Contacts',
  icon: 'i-lucide-users'
}]
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar :mode="mode">
      <template #header>
        <LogoPro class="h-5 w-auto" />
      </template>

      <UNavigationMenu
        :items="items"
        orientation="vertical"
      />
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar title="Dashboard" />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
