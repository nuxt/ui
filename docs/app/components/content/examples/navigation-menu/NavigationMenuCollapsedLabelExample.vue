<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  {
    label: 'Home',
    icon: 'i-lucide-house'
  },
  {
    label: 'Search',
    icon: 'i-lucide-search'
  },
  {
    label: 'Users',
    icon: 'i-lucide-users',
    active: true
  },
  {
    label: 'Settings',
    icon: 'i-lucide-cog'
  }
]
</script>

<template>
  <UNavigationMenu
    collapsed
    orientation="vertical"
    :items="items"
    :ui="{
      link: 'flex-col gap-1',
      linkLabel: 'block text-[10px]/3 text-center'
    }"
  />
</template>
