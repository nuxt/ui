<script setup lang="ts">
const groups = [{
  id: 'settings',
  items: [{
    label: 'Profile',
    icon: 'i-heroicons-user',
    kbds: ['meta', 'P']
  }, {
    label: 'Billing',
    icon: 'i-heroicons-credit-card',
    kbds: ['meta', 'B'],
    slot: 'billing'
  }, {
    label: 'Notifications',
    icon: 'i-heroicons-bell'
  }, {
    label: 'Security',
    icon: 'i-heroicons-lock-closed'
  }]
}, {
  id: 'users',
  label: 'Users',
  slot: 'users',
  items: [
    { id: 1, label: 'Durward Reynolds' },
    { id: 2, label: 'Kenton Towne' },
    { id: 3, label: 'Therese Wunsch' },
    { id: 4, label: 'Benedict Kessler' },
    { id: 5, label: 'Katelyn Rohan' }
  ]
}]
</script>

<template>
  <UCommandPalette :groups="groups" class="flex-1 h-80">
    <template #users-leading="{ index }">
      <UAvatar :src="`https://i.pravatar.cc/120?img=${index}`" size="2xs" />
    </template>

    <template #billing-label="{ item }">
      {{ item.label }}

      <UBadge variant="subtle" size="sm">
        50% off
      </UBadge>
    </template>
  </UCommandPalette>
</template>
