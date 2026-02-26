<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  {
    label: 'Home',
    icon: 'i-lucide-house',
    active: true
  },
  {
    label: 'Samples',
    icon: 'i-lucide-circle-play'
  },
  {
    label: 'Explore',
    icon: 'i-lucide-compass'
  },
  {
    label: 'Library',
    icon: 'i-lucide-bookmark'
  }
]
</script>

<template>
  <UNavigationMenu
    :items="items"
    :ui="{
      root: 'justify-around border-t border-default py-2',
      item: 'py-0',
      link: 'flex-col gap-1 px-3',
      linkLeadingIcon: 'size-5',
      linkLabel: 'text-[10px]/3 font-normal'
    }"
    class="w-full"
  />
</template>
