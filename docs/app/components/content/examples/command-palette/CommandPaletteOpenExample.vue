<script setup lang="ts">
const open = ref(false)

const users = [
  { id: 1, label: 'Durward Reynolds' },
  { id: 2, label: 'Kenton Towne' },
  { id: 3, label: 'Therese Wunsch' },
  { id: 4, label: 'Benedict Kessler' },
  { id: 5, label: 'Katelyn Rohan' }
]
</script>

<template>
  <UModal v-model:open="open">
    <UButton
      label="Search users..."
      color="gray"
      variant="subtle"
      icon="i-heroicons-magnifying-glass"
    />

    <template #content>
      <UCommandPalette
        close
        :groups="[{ id: 'users', items: users }]"
        @update:open="open = $event"
      />
    </template>
  </UModal>
</template>
