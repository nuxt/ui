<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const navItems: NavigationMenuItem[] = [{
  label: 'Home',
  icon: 'i-lucide-house',
  active: true
}, {
  label: 'Inbox',
  icon: 'i-lucide-inbox'
}]

const chatItems: NavigationMenuItem[] = [{
  label: 'Today',
  icon: 'i-lucide-message-circle'
}, {
  label: 'History',
  icon: 'i-lucide-clock'
}]
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar id="nav" collapsible>
      <template #header>
        <Logo class="h-5 w-auto" />
      </template>

      <UNavigationMenu
        :items="navItems"
        orientation="vertical"
      />
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar title="Dashboard" :toggle="{ target: 'nav' }">
          <template #right>
            <UDashboardSidebarToggle target="chat" side="right" />
          </template>
        </UDashboardNavbar>
      </template>
    </UDashboardPanel>

    <UDashboardSidebar id="chat" side="right" collapsible>
      <template #header>
        <span class="font-semibold">Chat</span>
        <UDashboardSidebarCollapse class="ms-auto" />
      </template>

      <UNavigationMenu
        :items="chatItems"
        orientation="vertical"
      />
    </UDashboardSidebar>
  </UDashboardGroup>
</template>
