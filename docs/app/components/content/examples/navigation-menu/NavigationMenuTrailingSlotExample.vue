<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[][] = [
  [
    {
      label: 'Personal',
      type: 'label',
      slot: 'personal-label' as const
    },
    {
      label: 'Design System',
      icon: 'i-lucide-folder',
      active: true
    },
    {
      label: 'Travel',
      icon: 'i-lucide-folder'
    }
  ],
  [
    {
      label: 'Teams',
      type: 'label',
      slot: 'teams-label' as const
    },
    {
      label: 'Engineering',
      icon: 'i-lucide-folder'
    },
    {
      label: 'Marketing',
      icon: 'i-lucide-folder'
    }
  ]
]

const dropdownItems: DropdownMenuItem[][] = [
  [
    { label: 'View Project', icon: 'i-lucide-folder-open' },
    { label: 'Share Project', icon: 'i-lucide-share' }
  ],
  [
    { label: 'Delete Project', icon: 'i-lucide-trash', color: 'error' }
  ]
]
</script>

<template>
  <UNavigationMenu
    orientation="vertical"
    :items="items"
    :ui="{ link: 'overflow-hidden has-data-[state=open]:before:bg-elevated/50' }"
    class="w-48"
  >
    <template #personal-label-trailing>
      <UButton icon="i-lucide-plus" color="neutral" variant="ghost" size="xs" />
    </template>

    <template #teams-label-trailing>
      <UButton icon="i-lucide-plus" color="neutral" variant="ghost" size="xs" />
    </template>

    <template #item-trailing>
      <div class="flex -mr-1.5 -my-0.5 translate-x-full group-hover:translate-x-0 has-data-[state=open]:translate-x-0 transition-transform">
        <UDropdownMenu
          :items="dropdownItems"
          :content="{ align: 'start' }"
          :modal="false"
          size="xs"
        >
          <UButton
            as="div"
            icon="i-lucide-ellipsis"
            color="neutral"
            variant="ghost"
            size="xs"
            class="text-muted hover:text-highlighted hover:bg-accented/50 data-[state=open]:bg-accented/50 mr-1.5"
          />
        </UDropdownMenu>
      </div>
    </template>
  </UNavigationMenu>
</template>
