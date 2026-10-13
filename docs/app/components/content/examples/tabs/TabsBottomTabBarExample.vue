<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const items: TabsItem[] = [
  {
    label: 'Home',
    icon: 'i-lucide-house'
  },
  {
    label: 'Activity',
    icon: 'i-lucide-activity'
  },
  {
    label: 'Settings',
    icon: 'i-lucide-settings'
  },
  {
    label: 'Profile',
    icon: 'i-lucide-user'
  }
]
</script>

<template>
  <UTabs
    :items="items"
    :content="false"
    :ui="{
      list: 'justify-around w-full',
      trigger: 'grow flex-col gap-1 py-1',
      label: 'text-[10px]/3'
    }"
    class="w-full"
  />
</template>
