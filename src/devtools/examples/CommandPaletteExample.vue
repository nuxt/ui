<template>
  <UCommandPalette :groups="groups" />
</template>

<script setup lang="ts">
const groups = [{
  id: 'actions',
  items: [{
    label: 'Add new file',
    suffix: 'Create a new file in the current directory or workspace.',
    icon: 'i-heroicons-document-plus'
  }, {
    label: 'Add new folder',
    suffix: 'Create a new folder in the current directory or workspace.',
    icon: 'i-heroicons-folder-plus',
    kbds: ['meta', 'F']
  }, {
    label: 'Add hashtag',
    suffix: 'Add a hashtag to the current item.',
    icon: 'i-heroicons-hashtag',
    kbds: ['meta', 'H']
  }, {
    label: 'Add label',
    suffix: 'Add a label to the current item.',
    icon: 'i-heroicons-tag',
    kbds: ['meta', 'L']
  }]
}]
</script>
