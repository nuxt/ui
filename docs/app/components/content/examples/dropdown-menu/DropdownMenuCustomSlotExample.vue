<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const items = [
  {
    label: 'Profile',
    icon: 'i-lucide-user',
    slot: 'profile' as const
  }, {
    label: 'Billing',
    icon: 'i-lucide-credit-card'
  }, {
    label: 'Settings',
    icon: 'i-lucide-cog'
  }
] satisfies DropdownMenuItem[]
</script>

<template>
  <UDropdownMenu :items="items" :ui="{ content: 'w-48' }">
    <UButton label="Open" color="neutral" variant="outline" icon="i-lucide-menu" />

    <template #profile-trailing>
      <UIcon name="i-lucide-badge-check" class="shrink-0 size-5 text-primary" />
    </template>
  </UDropdownMenu>
</template>
