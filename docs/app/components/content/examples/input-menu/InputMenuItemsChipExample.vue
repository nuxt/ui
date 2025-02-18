<script setup lang="ts">
import type { InputMenuItem } from '@nuxt/ui'

const items = ref([
  {
    label: 'bug',
    value: 'bug',
    chip: {
      color: 'error' as const
    }
  },
  {
    label: 'feature',
    value: 'feature',
    chip: {
      color: 'success' as const
    }
  },
  {
    label: 'enhancement',
    value: 'enhancement',
    chip: {
      color: 'info' as const
    }
  }
] satisfies InputMenuItem[])

const value = ref(items.value[0])
</script>

<template>
  <UInputMenu v-model="value" :items="items">
    <template #leading="{ modelValue, ui }">
      <UChip
        v-if="modelValue"
        v-bind="modelValue.chip"
        inset
        standalone
        :size="ui.itemLeadingChipSize()"
        :class="ui.itemLeadingChip()"
      />
    </template>
  </UInputMenu>
</template>
