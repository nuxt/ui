<script setup lang="ts">
const items = ref([
  {
    label: 'bug',
    value: 'bug',
    chip: {
      color: 'red' as const
    }
  },
  {
    label: 'enhancement',
    value: 'enhancement',
    chip: {
      color: 'blue' as const
    }
  },
  {
    label: 'feature',
    value: 'feature',
    chip: {
      color: 'violet' as const
    }
  }
])
const selected = ref(items.value[0])
</script>

<template>
  <USelectMenu v-model="selected" :items="items" class="w-40">
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
