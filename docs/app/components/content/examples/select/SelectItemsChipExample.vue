<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'

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
] satisfies SelectItem[])

const value = ref(items.value[0]?.value)
</script>

<template>
  <USelect v-model="value" :items="items" value-key="value" class="w-48">
    <template #leading="{ item, ui }">
      <UChip
        v-if="item"
        v-bind="item.chip"
        inset
        standalone
        size="md"
        :class="ui.itemLeadingChip()"
      />
    </template>
  </USelect>
</template>
