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
  icon: 'i-lucide-inbox',
  badge: '4'
}, {
  label: 'Contacts',
  icon: 'i-lucide-users'
}]
</script>

<template>
  <div class="flex flex-1">
    <USidebar v-model:open="open" title="Navigation" collapsible="icon">
      <UNavigationMenu
        :collapsed="!open"
        :items="items"
        orientation="vertical"
        :ui="{ link: 'p-1.5 overflow-hidden' }"
      />
    </USidebar>

    <div class="flex-1 flex flex-col">
      <UHeader toggle-side="left" :ui="{ container: 'px-4!' }">
        <template #toggle>
          <UButton
            icon="i-lucide-panel-left"
            color="neutral"
            variant="ghost"
            @click="open = !open"
          />
        </template>
      </UHeader>

      <div class="flex-1 p-4">
        <USkeleton class="size-full animate-pulse" />
      </div>
    </div>
  </div>
</template>
