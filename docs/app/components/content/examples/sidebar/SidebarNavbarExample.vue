<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = ref(true)

const items: NavigationMenuItem[] = [{
  label: 'Home',
  icon: 'i-lucide-house',
  active: true
}, {
  label: 'Inbox',
  icon: 'i-lucide-inbox',
  badge: '4'
}, {
  label: 'Contacts',
  icon: 'i-lucide-users'
}]
</script>

<template>
  <div class="flex flex-col flex-1">
    <div class="h-(--ui-header-height) shrink-0 flex items-center gap-2 px-4 border-b border-default">
      <UButton
        icon="i-lucide-panel-left"
        color="neutral"
        variant="ghost"
        @click="open = !open"
      />

      <span class="text-highlighted font-semibold">Dashboard</span>
    </div>

    <div class="flex flex-1 min-h-0">
      <USidebar
        v-model:open="open"
        collapsible="icon"
        :ui="{
          gap: 'h-[calc(100%-var(--ui-header-height))]',
          container: 'absolute top-(--ui-header-height) bottom-0 h-[calc(100%-var(--ui-header-height))]'
        }"
      >
        <template #default="{ state }">
          <UNavigationMenu
            :collapsed="state === 'collapsed'"
            :items="items"
            orientation="vertical"
            :ui="{ link: 'p-1.5' }"
          />
        </template>
      </USidebar>

      <div class="flex-1" />
    </div>
  </div>
</template>
