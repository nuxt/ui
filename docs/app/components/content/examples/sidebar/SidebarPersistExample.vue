<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = useLocalStorage('sidebar-open', true)

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
  <div class="flex h-full w-full [contain:paint]">
    <USidebar v-model:open="open" collapsible="icon" :ui="{ container: 'absolute' }">
      <template #header="{ state }">
        <span v-if="state === 'expanded'" class="font-semibold text-sm">Navigation</span>
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

        <span class="font-semibold text-sm">Page Title</span>
      </div>

      <div class="flex-1" />
    </div>
  </div>
</template>
