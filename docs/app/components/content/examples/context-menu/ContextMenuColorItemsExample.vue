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
  <UContextMenu :items="items" class="w-48" />
</template>
