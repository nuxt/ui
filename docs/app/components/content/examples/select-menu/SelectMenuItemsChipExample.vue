<script setup lang="ts">
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
])
const value = ref(items.value[0])
</script>

<template>
  <USelectMenu v-model="value" :items="items" class="w-48">
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
  </USelectMenu>
</template>
