<script setup lang="ts">
const open = ref(false)

defineShortcuts({
  o: () => open.value = !open.value
})

const shortcuts = [{
  label: 'Toggle this drawer',
  keys: ['O']
}, {
  label: 'Search',
  keys: ['meta', 'K']
}, {
  label: 'Close',
  keys: ['escape']
}]
</script>

<template>
  <UDrawer v-model:open="open" title="Keyboard shortcuts" description="Press O anywhere on the page to toggle this drawer." :ui="{ container: 'max-w-xl mx-auto' }">
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body>
      <ul class="divide-y divide-default">
        <li v-for="shortcut in shortcuts" :key="shortcut.label" class="flex items-center justify-between py-3 text-sm">
          <span class="text-muted">{{ shortcut.label }}</span>

          <span class="flex items-center gap-1">
            <UKbd v-for="key in shortcut.keys" :key="key" :value="key" />
          </span>
        </li>
      </ul>
    </template>
  </UDrawer>
</template>
