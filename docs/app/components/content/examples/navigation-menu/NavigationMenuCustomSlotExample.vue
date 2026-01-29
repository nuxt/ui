<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'

const items = [
  {
    label: 'Guide',
    icon: 'i-lucide-book-open',
    to: '/docs/getting-started'
  },
  {
    label: 'Composables',
    icon: 'i-lucide-database',
    to: '/docs/composables',
    class: 'hidden'
  },
  {
    label: 'Components',
    icon: 'i-lucide-box',
    to: '/docs/components',
    class: 'hidden'
  },
  {
    slot: 'more' as const,
    as: 'span',
    class: 'p-0',
    content: {
      align: 'start' as const
    },
    items: [
      {
        label: 'Composables',
        icon: 'i-lucide-database',
        to: '/docs/composables'
      },
      {
        label: 'Components',
        icon: 'i-lucide-box',
        to: '/docs/components'
      }
    ] satisfies DropdownMenuItem[]
  },
  {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    to: 'https://github.com/nuxt/ui',
    target: '_blank',
    slot: 'github' as const
  }
] satisfies NavigationMenuItem[]
</script>

<template>
  <UNavigationMenu :items="items" class="w-full justify-center">
    <template #more="{ item }">
      <UDropdownMenu :content="item.content" :items="item.items">
        <UButton icon="i-lucide-ellipsis" color="neutral" variant="link" />
      </UDropdownMenu>
    </template>

    <template #github-trailing>
      <UBadge label="6k+" color="neutral" variant="subtle" size="sm" />
    </template>
  </UNavigationMenu>
</template>
