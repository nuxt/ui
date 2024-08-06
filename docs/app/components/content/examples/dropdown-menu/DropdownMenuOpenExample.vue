<script setup lang="ts">
const open = ref(true)

defineShortcuts({
  o: () => open.value = !open.value
})

const items = [{
  label: 'Profile',
  icon: 'i-heroicons-user'
}, {
  label: 'Billing',
  icon: 'i-heroicons-credit-card'
}, {
  label: 'Settings',
  icon: 'i-heroicons-cog'
}]
</script>

<template>
  <UDropdownMenu v-model:open="open" :items="items" class="w-48">
    <UButton label="Open" color="gray" variant="outline" icon="i-heroicons-bars-3" />
  </UDropdownMenu>
</template>
