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
}, {
  label: 'Settings',
  icon: 'i-lucide-settings'
}]
</script>

<template>
  <div class="flex flex-1">
    <USidebar
      v-model:open="open"
      variant="inset"
      collapsible="icon"
      :ui="{ container: 'absolute' }"
    >
      <template #header>
        <Logo class="h-5 shrink-0" />
      </template>

      <template #default="{ state }">
        <UNavigationMenu
          :collapsed="state === 'collapsed'"
          :items="items"
          orientation="vertical"
        />
      </template>

      <template #footer>
        <UButton
          :avatar="{ src: 'https://github.com/benjamincanac.png' }"
          label="Benjamin"
          color="neutral"
          variant="ghost"
          class="w-full overflow-hidden group-data-[state=collapsed]/sidebar:size-8! group-data-[state=collapsed]/sidebar:p-0!"
        />
      </template>
    </USidebar>

    <div class="flex-1 flex flex-col overflow-hidden lg:peer-data-[variant=inset]:my-2 lg:peer-data-[variant=inset]:ms-0 lg:peer-data-[variant=inset]:rounded-xl lg:peer-data-[variant=inset]:shadow-sm lg:peer-data-[variant=inset]:ring lg:peer-data-[variant=inset]:ring-default">
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
