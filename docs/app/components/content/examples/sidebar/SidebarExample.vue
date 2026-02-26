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
  <div class="flex h-full w-full contain-[paint]">
    <USidebar
      v-model:open="open"
      collapsible="icon"
      rail
      :ui="{ inner: 'divide-y-0 bg-muted' }"
    >
      <template #header="{ state }">
        <UDropdownMenu
          :items="teamsItems"
          :content="{ align: 'start', collisionPadding: 12 }"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-56' }"
        >
          <UButton
            v-bind="selectedTeam"
            trailing-icon="i-lucide-chevrons-up-down"
            color="neutral"
            variant="ghost"
            block
            :square="state === 'collapsed'"
            class="overflow-hidden data-[state=open]:bg-elevated"
            :ui="{ trailingIcon: 'text-dimmed group-data-[state=collapsed]/sidebar:hidden' }"
          />
        </UDropdownMenu>
      </template>

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
          label="Benjamin"
          color="neutral"
          variant="ghost"
          :square="state === 'collapsed'"
          class="w-full overflow-hidden"
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
