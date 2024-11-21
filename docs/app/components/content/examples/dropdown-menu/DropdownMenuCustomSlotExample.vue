<script setup lang="ts">
const items = [{
  label: 'Profile',
  icon: 'i-lucide-user',
  slot: 'profile'
}, {
  label: 'Billing',
  icon: 'i-lucide-credit-card'
}, {
  label: 'Settings',
  icon: 'i-lucide-cog'
}]
</script>

<template>
  <UDropdownMenu :items="items" :ui="{ content: 'w-48' }">
    <UButton label="Open" color="neutral" variant="outline" icon="i-lucide-menu" />

    <template #profile-trailing>
      <UIcon name="i-lucide-badge-check" class="shrink-0 size-5 text-[var(--ui-primary)]" />
    </template>
  </UDropdownMenu>
</template>
