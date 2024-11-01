<script setup lang="ts">
const items = [
  [
    {
      label: 'View',
      icon: 'i-heroicons-eye'
    },
    {
      label: 'Copy',
      icon: 'i-heroicons-document-duplicate'
    },
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil'
    }
  ],
  [
    {
      label: 'Delete',
      color: 'error',
      icon: 'i-heroicons-trash'
    }
  ]
]
</script>

<template>
  <UDropdownMenu :items="items" class="w-48">
    <UButton label="Open" color="neutral" variant="outline" icon="i-heroicons-bars-3" />

    <template #profile-trailing>
      <UIcon name="i-heroicons-check-badge" class="shrink-0 size-5 text-[var(--ui-primary)]" />
    </template>
  </UDropdownMenu>
</template>
