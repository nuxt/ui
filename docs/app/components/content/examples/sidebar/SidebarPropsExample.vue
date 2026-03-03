<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const props = withDefaults(defineProps<{
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
  side?: 'left' | 'right'
}>(), {
  variant: 'sidebar',
  collapsible: 'none',
  side: 'left'
})

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
  <div class="flex flex-1">
    <USidebar
      v-model:open="open"
      :variant="props.variant"
      :collapsible="props.collapsible"
      :side="props.side"
      title="Navigation"
    >
      <template #default="{ state }">
        <UNavigationMenu
          :collapsed="state === 'collapsed'"
          :items="items"
          orientation="vertical"
          :ui="{ link: 'p-1.5 overflow-hidden' }"
        />
      </template>
    </USidebar>

    <div class="flex-1 flex flex-col overflow-hidden lg:peer-data-[variant=inset]:my-2 lg:peer-data-[variant=floating]:my-2 lg:peer-data-[variant=inset]:ms-0 lg:peer-data-[variant=inset]:rounded-xl lg:peer-data-[variant=inset]:shadow-sm lg:peer-data-[variant=inset]:ring lg:peer-data-[variant=inset]:ring-default">
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
