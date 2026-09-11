<script setup lang="ts">
import type { ShortcutsConfig } from '@nuxt/ui/composables'

const pg = usePg()

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

  <div :class="pg.size_full_flex_flex_col_justify_stretch_items_stretch_gap_4">
    <UCard :ui="{ header: pg.flex_items_center_justify_between }">
      <template #header>
        <h3 :class="pg.font_bold">
          Test shortcuts
        </h3>

        <UInput placeholder="Input to test usingInput behavior" :class="pg.w_60" />
      </template>

      <div :class="pg.flex_flex_wrap_gap_2">
        <UKbd v-for="{ label } in shortcutsList" :key="label">
          {{ label }}
        </UKbd>
      </div>
    </UCard>

    <UCard :ui="{ body: pg.h_200px_overflow_y_auto }" :class="pg.flex_1">
      <template #header>
        <div :class="pg.flex_items_center_justify_between_gap_4">
          <h3 :class="pg.font_bold">
            Logs ({{ logs.length }})
          </h3>
          <UButton icon="i-lucide-trash" size="sm" color="neutral" :class="pg.my_1" @click="logs = []" />
        </div>
      </template>

      <div v-if="logs.length === 0" :class="pg.text_muted">
        Press any shortcut...
      </div>
      <p v-for="(log, index) of logs" :key="index" :class="pg.font_mono_text_sm">
        {{ log }}
      </p>
    </UCard>
  </div>
</template>
