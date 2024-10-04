<script setup lang="ts">
const items = [{
  label: 'Team',
  icon: 'i-heroicons-users'
}, {
  label: 'Invite users',
  icon: 'i-heroicons-user-plus',
  children: [{
    label: 'Invite by email',
    icon: 'i-heroicons-paper-airplane'
  }, {
    label: 'Invite by link',
    icon: 'i-heroicons-link'
  }]
}, {
  label: 'New team',
  icon: 'i-heroicons-plus'
}]
</script>

<template>
  <UButtonGroup>
    <UButton color="neutral" variant="subtle" label="Settings" />

    <UDropdownMenu :items="items">
      <UButton
        color="neutral"
        variant="outline"
        icon="i-heroicons-chevron-down-20-solid"
      />
    </UDropdownMenu>
  </UButtonGroup>
</template>
