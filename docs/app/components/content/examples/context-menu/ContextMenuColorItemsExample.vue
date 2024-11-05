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
      color: 'error' as const,
      icon: 'i-heroicons-trash'
    }
  ]
]
</script>

<template>
  <UContextMenu :items="items" class="w-48">
    <div class="flex items-center justify-center rounded-md border border-dashed border-[var(--ui-border-accented)] text-sm aspect-video w-72">
      Right click here
    </div>
  </UContextMenu>
</template>
