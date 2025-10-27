<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const items = [
  {
    label: 'Filter A',
    icon: 'i-lucide-user'
  }, {
    label: 'Filter B',
    icon: 'i-lucide-credit-card'
  }, {
    label: 'Filters C',
    icon: 'i-lucide-filter',
    children: [
      {
        label: 'Filter C-A',
        icon: 'i-lucide-user'
      }, {
        label: 'Filter C-B',
        icon: 'i-lucide-credit-card'
      }, {
        label: 'Filter C-C',
        icon: 'i-lucide-filter'
      }
    ]
  }, {
    label: 'Other filters',
    icon: 'i-lucide-list-filter-plus',
    children: [
      {
        label: 'Filter D',
        icon: 'i-lucide-user'
      }, {
        label: 'Filter E',
        icon: 'i-lucide-credit-card'
      }, {
        label: 'Filter F',
        icon: 'i-lucide-filter'
      },
      {
        label: 'Filter G',
        icon: 'i-lucide-list-filter'
      }
    ]
  }
] satisfies DropdownMenuItem[]
</script>

<template>
  <UDropdownMenu :items="items" :ui="{ content: 'w-48' }" :search="2">
    <UButton label="Open" color="neutral" variant="outline" icon="i-lucide-menu" />
  </UDropdownMenu>
</template>
