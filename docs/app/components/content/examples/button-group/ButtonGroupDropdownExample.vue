<script setup lang="ts">
const items = [{
  label: 'Team',
  icon: 'i-lucide-users'
}, {
  label: 'Invite users',
  icon: 'i-lucide-user-plus',
  children: [{
    label: 'Invite by email',
    icon: 'i-lucide-send-horizontal'
  }, {
    label: 'Invite by link',
    icon: 'i-lucide-link'
  }]
}, {
  label: 'New team',
  icon: 'i-lucide-plus'
}]
</script>

<template>
  <UButtonGroup>
    <UButton color="neutral" variant="subtle" label="Settings" />

    <UDropdownMenu :items="items">
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-chevron-down"
      />
    </UDropdownMenu>
  </UButtonGroup>
</template>
