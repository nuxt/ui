<template>
  <UList>
    <template #separator-before>
      <hr class="border-gray-200 dark:border-gray-800 my-2">
    </template>

    <div v-for="(item, key) in items" :key="key" class="flex items-center gap-2">
      <UIcon :name="item.icon" /> {{ item.label }}
    </div>
  </UList>
</template>

<script setup>
const items = [
  { label: 'Home', icon: 'i-heroicons-home' },
  { label: 'Profile', icon: 'i-heroicons-user-circle' },
  { label: 'Security', icon: 'i-heroicons-shield-check' },
  { label: 'Password Reset', icon: 'i-heroicons-key' }
]
</script>
