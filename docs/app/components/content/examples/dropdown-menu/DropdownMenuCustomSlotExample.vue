<script setup lang="ts">
const items = [{
  label: 'Profile',
  icon: 'i-heroicons-user',
  slot: 'profile'
}, {
  label: 'Billing',
  icon: 'i-heroicons-credit-card'
}, {
  label: 'Settings',
  icon: 'i-heroicons-cog'
}]
</script>

<template>
  <UDropdownMenu :items="items" class="w-48">
    <UButton label="Open" color="gray" variant="outline" icon="i-heroicons-bars-3" />

    <template #profile-trailing>
      <UIcon name="i-heroicons-check-badge" class="shrink-0 size-5 text-primary-500 dark:text-primary-400" />
    </template>
  </UDropdownMenu>
</template>
