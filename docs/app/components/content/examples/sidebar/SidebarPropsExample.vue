<script setup lang="ts">
import type { NavigationMenuItem, SidebarProps } from '@nuxt/ui'

defineProps<SidebarProps>()

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
  <div
    class="flex flex-1"
    :class="[
      variant === 'inset' && 'bg-neutral-50 dark:bg-neutral-950',
      side === 'right' && 'flex-row-reverse'
    ]"
  >
    <USidebar
      v-model:open="open"
      :variant="variant"
      :collapsible="collapsible"
      :side="side"
      title="Navigation"
      :ui="{
        container: 'h-full'
      }"
    >
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        :ui="{ link: 'p-1.5 overflow-hidden' }"
      />
    </USidebar>

    <div class="flex-1 flex flex-col overflow-hidden lg:peer-data-[variant=floating]:my-4 lg:peer-data-[variant=inset]:my-4 lg:peer-data-[variant=inset]:rounded-xl lg:peer-data-[variant=inset]:shadow lg:peer-data-[variant=inset]:ring lg:peer-data-[variant=inset]:ring-default bg-default">
      <div class="h-(--ui-header-height) shrink-0 flex items-center px-4">
        <UButton
          icon="i-lucide-panel-left"
          color="neutral"
          variant="ghost"
          @click="open = !open"
        />
      </div>

      <div class="flex-1 p-4">
        <USkeleton class="size-full animate-pulse" />
      </div>
    </div>
  </div>
</template>
