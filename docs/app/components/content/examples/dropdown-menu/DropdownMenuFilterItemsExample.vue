<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const items: DropdownMenuItem[][] = [[{
  label: 'Profile',
  icon: 'i-lucide-user'
}, {
  label: 'Billing',
  icon: 'i-lucide-credit-card'
}, {
  label: 'Settings',
  icon: 'i-lucide-cog'
}], [{
  label: 'Team',
  icon: 'i-lucide-users',
  filter: {
    placeholder: 'Search members...'
  },
  children: [
    {
      label: 'benjamincanac',
      avatar: { src: 'https://github.com/benjamincanac.png', loading: 'lazy' as const }
    },
    {
      label: 'HugoRCD',
      avatar: { src: 'https://github.com/HugoRCD.png', loading: 'lazy' as const }
    },
    {
      label: 'romhml',
      avatar: { src: 'https://github.com/romhml.png', loading: 'lazy' as const }
    },
    {
      label: 'sandros94',
      avatar: { src: 'https://github.com/sandros94.png', loading: 'lazy' as const }
    },
    {
      label: 'hywax',
      avatar: { src: 'https://github.com/hywax.png', loading: 'lazy' as const }
    },
    {
      label: 'J-Michalek',
      avatar: { src: 'https://github.com/J-Michalek.png', loading: 'lazy' as const }
    },
    {
      label: 'genu',
      avatar: { src: 'https://github.com/genu.png', loading: 'lazy' as const }
    }
  ]
}, {
  label: 'Invite users',
  icon: 'i-lucide-user-plus',
  children: [{
    label: 'Invite by email',
    icon: 'i-lucide-mail'
  }, {
    label: 'Invite by link',
    icon: 'i-lucide-link'
  }, {
    label: 'Invite by SMS',
    icon: 'i-lucide-message-square'
  }, {
    label: 'Invite by WhatsApp',
    icon: 'i-simple-icons-whatsapp'
  }]
}, {
  label: 'New team',
  icon: 'i-lucide-plus'
}]]
</script>

<template>
  <UDropdownMenu :items="items" :content="{ align: 'start' }" :ui="{ content: 'w-48' }">
    <UButton label="Open" color="neutral" variant="outline" icon="i-lucide-menu" />
  </UDropdownMenu>
</template>
