<script setup lang="ts">
const groups = [{
  id: 'settings',
  items: [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      kbds: ['meta', 'P']
    },
    {
      label: 'Billing',
      icon: 'i-lucide-credit-card',
      kbds: ['meta', 'B'],
      slot: 'billing'
    },
    {
      label: 'Notifications',
      icon: 'i-lucide-bell'
    },
    {
      label: 'Security',
      icon: 'i-lucide-lock'
    }
  ]
}, {
  id: 'users',
  label: 'Users',
  slot: 'users',
  items: [
    {
      label: 'Benjamin Canac',
      suffix: 'benjamincanac'
    },
    {
      label: 'Sylvain Marroufin',
      suffix: 'smarroufin'
    },
    {
      label: 'Sébastien Chopin',
      suffix: 'atinux'
    },
    {
      label: 'Romain Hamel',
      suffix: 'romhml'
    },
    {
      label: 'Haytham A. Salama',
      suffix: 'Haythamasalama'
    },
    {
      label: 'Daniel Roe',
      suffix: 'danielroe'
    },
    {
      label: 'Neil Richter',
      suffix: 'noook'
    }
  ]
}]
</script>

<template>
  <UCommandPalette :groups="groups" class="flex-1 h-80">
    <template #users-leading="{ item }">
      <UAvatar :src="`https://github.com/${item.suffix}.png`" size="2xs" />
    </template>

    <template #billing-label="{ item }">
      {{ item.label }}

      <UBadge variant="subtle" size="sm">
        50% off
      </UBadge>
    </template>
  </UCommandPalette>
</template>
