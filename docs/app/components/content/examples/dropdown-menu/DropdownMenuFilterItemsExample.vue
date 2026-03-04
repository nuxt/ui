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
  icon: 'i-lucide-users'
}, {
  label: 'Invite users',
  icon: 'i-lucide-user-plus',
  input: true,
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
