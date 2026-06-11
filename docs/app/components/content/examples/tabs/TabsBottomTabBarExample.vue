<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const items: TabsItem[] = [
  {
    label: 'Home',
    icon: 'i-lucide-house',
    content: 'Home content'
  },
  {
    label: 'Activity',
    icon: 'i-lucide-activity',
    content: 'Activity content'
  },
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    content: 'Settings content'
  },
  {
    label: 'Profile',
    icon: 'i-lucide-user',
    content: 'Profile content'
  }
]
</script>

<template>
  <UTabs
    variant="pill"
    :items="items"
    :ui="{
      list: 'justify-around w-full',
      trigger: 'grow-1 flex-col gap-1 py-1',
      label: 'text-[10px]/3'
    }"
    class="w-full"
  />
</template>
