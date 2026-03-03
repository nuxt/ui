<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const open = ref(true)

const teams = ref([{
  label: 'Nuxt',
  avatar: {
    src: 'https://github.com/nuxt.png',
    alt: 'Nuxt'
  }
}, {
  label: 'Vue',
  avatar: {
    src: 'https://github.com/vuejs.png',
    alt: 'Vue'
  }
}, {
  label: 'UnJS',
  avatar: {
    src: 'https://github.com/unjs.png',
    alt: 'UnJS'
  }
}])
const selectedTeam = ref(teams.value[0])

const teamsItems = computed<DropdownMenuItem[][]>(() => {
  return [teams.value.map((team, index) => ({
    ...team,
    kbds: ['meta', String(index + 1)],
    onSelect() {
      selectedTeam.value = team
    }
  })), [{
    label: 'Create team',
    icon: 'i-lucide-circle-plus'
  }]]
})

const items: NavigationMenuItem[] = [{
  label: 'Inbox',
  icon: 'i-lucide-inbox',
  badge: '4'
}, {
  label: 'Issues',
  icon: 'i-lucide-square-dot'
}, {
  label: 'Activity',
  icon: 'i-lucide-square-activity'
}, {
  label: 'Settings',
  icon: 'i-lucide-settings',
  defaultOpen: true,
  children: [{
    label: 'General',
    icon: 'i-lucide-house'
  }, {
    label: 'Team',
    icon: 'i-lucide-users'
  }, {
    label: 'Billing',
    icon: 'i-lucide-credit-card'
  }]
}]

defineShortcuts(extractShortcuts(teamsItems.value))
</script>

<template>
  <div class="flex flex-1">
    <USidebar
      v-model:open="open"
      collapsible="icon"
      rail
      :ui="{
        header: 'min-w-0',
        inner: 'bg-elevated/25'
      }"
    >
      <template #header="{ state }">
        <UDropdownMenu
          :items="teamsItems"
          :content="{ align: 'start' }"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-48' }"
        >
          <UButton
            v-bind="selectedTeam"
            trailing-icon="i-lucide-chevrons-up-down"
            color="neutral"
            variant="ghost"
            block
            :square="state === 'collapsed'"
            class="w-full data-[state=open]:bg-elevated"
            :ui="{
              trailingIcon: 'text-dimmed group-data-[state=collapsed]/sidebar:hidden'
            }"
          />
        </UDropdownMenu>
      </template>

      <template #default="{ state }">
        <UNavigationMenu
          :items="items"
          :collapsed="state === 'collapsed'"
          orientation="vertical"
          tooltip
          popover
        />
      </template>
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
