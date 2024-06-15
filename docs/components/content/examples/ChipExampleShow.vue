<script setup lang="ts">
const items = [{
  name: 'messages',
  icon: 'i-heroicons-chat-bubble-oval-left',
  count: 3
}, {
  name: 'notifications',
  icon: 'i-heroicons-bell',
  count: 0
}]
</script>

<template>
  <div class="flex gap-3">
    <UChip v-for="{ name, icon, count } in items" :key="name" :show="count > 0">
      <UButton :icon="icon" color="gray" />
    </UChip>
  </div>
</template>
