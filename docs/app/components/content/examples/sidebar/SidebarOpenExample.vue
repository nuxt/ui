<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = ref(true)

defineShortcuts({
  o: () => open.value = !open.value
})

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
  <div class="flex flex-1">
    <USidebar v-model:open="open" collapsible="icon">
      <template #header>
        <span class="font-semibold text-sm">Navigation</span>
      </template>

      <UNavigationMenu
        :collapsed="!open"
        :items="items"
        orientation="vertical"
      />
    </USidebar>

    <div class="flex-1 flex flex-col">
      <div class="h-(--ui-header-height) shrink-0 flex items-center gap-2 px-4 border-b border-default">
        <UButton
          icon="i-lucide-panel-left"
          color="neutral"
          variant="ghost"
          @click="open = !open"
        />

        <span class="text-highlighted font-semibold">Dashboard</span>
      </div>

      <div class="flex-1" />
    </div>
  </div>
</template>
