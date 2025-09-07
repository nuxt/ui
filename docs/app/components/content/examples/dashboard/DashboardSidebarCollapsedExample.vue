<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

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

const collapsed = ref(false)

defineShortcuts({
  c: () => collapsed.value = !collapsed.value
})
</script>

<template>
  <UDashboardSidebar v-model:collapsed="collapsed" collapsible>
    <template #header>
      <Logo class="h-5 w-auto" :collapsed="collapsed" />
    </template>

    <UNavigationMenu
      :collapsed="collapsed"
      :items="items"
      orientation="vertical"
    />
  </UDashboardSidebar>
</template>
