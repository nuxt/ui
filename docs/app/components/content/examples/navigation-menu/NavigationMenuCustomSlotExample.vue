<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = [
  {
    label: 'Guide',
    icon: 'i-lucide-book-open'
  },
  {
    label: 'Composables',
    icon: 'i-lucide-database'
  },
  {
    label: 'Components',
    icon: 'i-lucide-box',
    slot: 'components' as const
  }
] satisfies NavigationMenuItem[]
</script>

<template>
  <UNavigationMenu :items="items" class="w-full justify-center">
    <template #components-trailing>
      <UBadge label="44" variant="subtle" size="sm" />
    </template>
  </UNavigationMenu>
</template>
