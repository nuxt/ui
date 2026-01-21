<script setup lang="ts">
import type { ShortcutsConfig } from '@nuxt/ui/composables/defineShortcuts'

const logs = ref<string[]>([])

// Shortcuts to test the shift+punctuation fix
const shortcutsList = [
  // The fix: these pairs should trigger independently
  { key: 'meta_.', label: '⌘.' },
  { key: 'meta_shift_.', label: '⌘⇧.' },
  { key: 'meta_,', label: '⌘,' },
  { key: 'meta_shift_,', label: '⌘⇧,' },

  // Alphabet keys (should also work)
  { key: 'meta_k', label: '⌘K' },
  { key: 'meta_shift_k', label: '⌘⇧K' },

  // Simple keys
  { key: 'a', label: 'A' },
  { key: 'shift_a', label: '⇧A' },

  // Chained shortcuts
  { key: 'g-i', label: 'G→I' }
]

const shortcuts = computed<ShortcutsConfig>(() => {
  return shortcutsList.reduce<ShortcutsConfig>((acc, { key, label }) => {
    acc[key] = () => {
      logs.value.unshift(`${label} (${key})`)
    }
    return acc
  }, {})
})

defineShortcuts(shortcuts)
</script>

<template>
  <Navbar />

  <div class="w-full flex flex-col justify-stretch items-stretch gap-4 h-full">
    <UCard :ui="{ header: 'flex items-center justify-between' }">
      <template #header>
        <h3 class="font-bold">
          Test shortcuts
        </h3>

        <UInput placeholder="Input to test usingInput behavior" class="w-60" />
      </template>

      <div class="flex flex-wrap gap-2">
        <UKbd v-for="{ label } in shortcutsList" :key="label">
          {{ label }}
        </UKbd>
      </div>
    </UCard>

    <UCard :ui="{ body: 'h-[200px] overflow-y-auto' }" class="flex-1">
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <h3 class="font-bold">
            Logs ({{ logs.length }})
          </h3>
          <UButton icon="i-lucide-trash" size="sm" color="neutral" class="-my-1" @click="logs = []" />
        </div>
      </template>

      <div v-if="logs.length === 0" class="text-muted">
        Press any shortcut...
      </div>
      <p v-for="(log, index) of logs" :key="index" class="font-mono text-sm">
        {{ log }}
      </p>
    </UCard>
  </div>
</template>
