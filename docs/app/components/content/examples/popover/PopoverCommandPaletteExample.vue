<script setup lang="ts">
import type { CommandPaletteItem } from '@nuxt/ui'

const items = ref([
  {
    label: 'bug',
    value: 'bug',
    chip: {
      color: 'error'
    }
  },
  {
    label: 'feature',
    value: 'feature',
    chip: {
      color: 'success'
    }
  },
  {
    label: 'enhancement',
    value: 'enhancement',
    chip: {
      color: 'info'
    }
  }
] satisfies CommandPaletteItem[])

const label = ref([])
</script>

<template>
  <UPopover :content="{ side: 'right', align: 'start' }">
    <UButton
      icon="i-lucide-tag"
      label="Select labels"
      color="neutral"
      variant="subtle"
    />

    <template #content>
      <UCommandPalette
        v-model="label"
        multiple
        :filter="{ placeholder: 'Search labels...' }"
        :groups="[{ id: 'labels', items }]"
      />
    </template>
  </UPopover>
</template>
