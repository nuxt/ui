<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const variant = computed(() => (route.query.variant as 'sidebar' | 'floating' | 'inset') || 'sidebar')
const collapsible = computed(() => (route.query.collapsible as 'offcanvas' | 'icon' | 'none') || 'icon')
const side = computed(() => (route.query.side as 'left' | 'right') || 'left')
const mode = computed(() => (route.query.mode as 'modal' | 'slideover' | 'drawer') || 'slideover')

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
  <div class="flex h-full w-full [contain:paint]">
    <USidebar
      v-model:open="open"
      :variant="variant"
      :collapsible="collapsible"
      :side="side"
      :mode="mode"
      title="Navigation"
      close
      :ui="{ container: 'absolute' }"
    >
      <template #default="{ state }">
        <UNavigationMenu
          :collapsed="state === 'collapsed'"
          :items="items"
          orientation="vertical"
        />
      </template>

      <template #footer="{ state }">
        <UButton
          :avatar="{ src: 'https://github.com/benjamincanac.png' }"
          :label="state === 'collapsed' ? undefined : 'Benjamin'"
          color="neutral"
          variant="ghost"
          class="w-full"
        />
      </template>
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
