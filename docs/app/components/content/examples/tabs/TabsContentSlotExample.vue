<script setup lang="ts">
const items = [
  {
    label: 'Account',
    icon: 'i-heroicons-user'
  },
  {
    label: 'Password',
    icon: 'i-heroicons-lock-closed'
  }
]
</script>

<template>
  <UTabs :items="items" class="w-full">
    <template #content="{ item }">
      <p>This is the {{ item.label }} tab.</p>
    </template>
  </UTabs>
</template>
