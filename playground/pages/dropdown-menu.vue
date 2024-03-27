<script setup lang="ts">
const items = [
  [{
    label: 'Profile',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    },
    active: true,
    select (e: Event) {
      e.preventDefault()
      console.log('Profile clicked')
    }
  }], [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square',
    shortcuts: ['E']
  }, {
    label: 'Duplicate',
    icon: 'i-heroicons-document-duplicate',
    shortcuts: ['D'],
    disabled: true
  }], [{
    label: 'Archive',
    icon: 'i-heroicons-archive-box'
  }, {
    label: 'Move',
    icon: 'i-heroicons-arrow-right-circle'
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash',
    shortcuts: ['⌘', 'D']
  }]
]
</script>

<template>
  <div>
    <UDropdownMenu :items="items" arrow>
      <UButton label="Open" />
    </UDropdownMenu>
  </div>
</template>
