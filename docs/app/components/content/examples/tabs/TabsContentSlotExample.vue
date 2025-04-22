<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const items: TabsItem[] = [
  {
    label: 'Account',
    icon: 'i-lucide-user'
  },
  {
    label: 'Password',
    icon: 'i-lucide-lock'
  }
]
</script>

<template>
  <UTabs :items="items" class="w-full">
    <template #content="{ item }">
      <p>This is the {{ item.label }} tab.</p>
    </template>
  </UTabs>
</template>
