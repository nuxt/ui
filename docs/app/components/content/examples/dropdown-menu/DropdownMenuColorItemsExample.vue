<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const items: DropdownMenuItem[][] = [
  [
    {
      label: 'View',
      icon: 'i-lucide-eye'
    },
    {
      label: 'Copy',
      icon: 'i-lucide-copy'
    },
    {
      label: 'Edit',
      icon: 'i-lucide-pencil'
    }
  ],
  [
    {
      label: 'Delete',
      color: 'error',
      icon: 'i-lucide-trash'
    }
  ]
]
</script>

<template>
  <UDropdownMenu :items="items" :ui="{ content: 'w-48' }">
    <UButton label="Open" color="neutral" variant="outline" icon="i-lucide-menu" />
  </UDropdownMenu>
</template>
