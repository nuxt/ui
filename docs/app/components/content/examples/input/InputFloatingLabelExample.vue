<script setup lang="ts">
const value = ref('')
</script>

<template>
  <UInput v-model="value" placeholder="" :ui="{ base: 'peer' }">
    <label class="pointer-events-none absolute left-0 -top-2.5 text-[var(--ui-text-highlighted)] text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-[var(--ui-text-highlighted)] peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-[var(--ui-text-dimmed)] peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
      <span class="inline-flex bg-[var(--ui-bg)] px-1">Email address</span>
    </label>
  </UInput>
</template>
