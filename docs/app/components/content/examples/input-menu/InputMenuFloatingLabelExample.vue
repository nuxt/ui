<script setup lang="ts">
const items = ref([
  'Backlog',
  'Todo',
  'In Progress',
  'Done'
])

const value = ref('')
</script>

<template>
  <UInputMenu v-model="value" :items="items" placeholder="" :ui="{ base: 'peer' }">
    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
      <span class="inline-flex bg-default px-1">Status</span>
    </label>
  </UInputMenu>
</template>
