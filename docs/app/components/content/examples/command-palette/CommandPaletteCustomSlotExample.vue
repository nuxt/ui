<script setup lang="ts">
const groups = [
  {
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
        slot: 'billing' as const
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
  },
  {
    id: 'users',
    label: 'Users',
    slot: 'users' as const,
    items: [
      {
        label: 'Benjamin Canac',
        suffix: 'benjamincanac',
        to: 'https://github.com/benjamincanac',
        target: '_blank'
      },
      {
        label: 'Sylvain Marroufin',
        suffix: 'smarroufin',
        to: 'https://github.com/smarroufin',
        target: '_blank'
      },
      {
        label: 'Sébastien Chopin',
        suffix: 'atinux',
        to: 'https://github.com/atinux',
        target: '_blank'
      },
      {
        label: 'Romain Hamel',
        suffix: 'romhml',
        to: 'https://github.com/romhml',
        target: '_blank'
      },
      {
        label: 'Haytham A. Salama',
        suffix: 'Haythamasalama',
        to: 'https://github.com/Haythamasalama',
        target: '_blank'
      },
      {
        label: 'Daniel Roe',
        suffix: 'danielroe',
        to: 'https://github.com/danielroe',
        target: '_blank'
      },
      {
        label: 'Neil Richter',
        suffix: 'noook',
        to: 'https://github.com/noook',
        target: '_blank'
      }
    ]
  }
]
</script>

<template>
  <UCommandPalette :groups="groups" class="flex-1 h-80">
    <template #users-leading="{ item }">
      <UAvatar :src="`https://github.com/${item.suffix}.png`" size="2xs" />
    </template>

    <template #billing-label="{ item }">
      <span class="font-medium text-primary">{{ item.label }}</span>

      <UBadge variant="subtle" size="sm">
        50% off
      </UBadge>
    </template>
  </UCommandPalette>
</template>
