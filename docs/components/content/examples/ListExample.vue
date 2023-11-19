<template>
  <UList>
    <div v-for="(item, key) in items" :key="key" class="flex items-center gap-2">
      <UIcon :name="item.icon" /> {{ item.label }}
    </div>

    <template #separator-after>
      <UDivider class="my-2" />
    </template>
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
