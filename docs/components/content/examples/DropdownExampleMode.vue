<script setup lang="ts">
const items = [
  [{
    label: 'Profile',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    }
  }]
]
</script>

<template>
  <UDropdown :items="items" mode="hover" :popper="{ placement: 'bottom-start' }">
    <UButton color="white" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid" />
  </UDropdown>
</template>
