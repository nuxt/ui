<script setup lang="ts">
const items = [
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
      color: 'error' as const,
      icon: 'i-lucide-trash'
    }
  ]
]
</script>

<template>
  <UDropdownMenu :items="items" :ui="{ content: 'w-48' }">
    <UButton label="Open" color="neutral" variant="outline" icon="i-lucide-menu" />

    <template #profile-trailing>
      <UIcon name="i-lucide-badge-check" class="shrink-0 size-5 text-[var(--ui-primary)]" />
    </template>
  </UDropdownMenu>
</template>
