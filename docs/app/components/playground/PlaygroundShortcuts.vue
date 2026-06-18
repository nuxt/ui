<script setup lang="ts">
const shortcuts = [
  { label: 'Search', keys: ['meta', 'K'] },
  { label: 'Quick actions', keys: ['meta', 'J'] },
  { label: 'New file', keys: ['meta', 'N'] },
  { label: 'Save', keys: ['meta', 'S'] },
  { label: 'Toggle sidebar', keys: ['meta', 'B'] }
]
</script>

<template>
  <div>
    <div class="p-4">
      <p class="font-semibold text-highlighted">
        Shortcuts
      </p>
      <p class="text-sm text-muted">
        Work faster with the keyboard.
      </p>
    </div>

    <USeparator />

    <ul class="divide-y divide-default">
      <li v-for="shortcut in shortcuts" :key="shortcut.label" class="flex items-center justify-between px-4 py-2.5">
        <span class="text-sm text-default">{{ shortcut.label }}</span>
        <div class="flex gap-1">
          <UKbd v-for="key in shortcut.keys" :key="key" :value="key" />
        </div>
      </li>
    </ul>
  </div>
</template>
