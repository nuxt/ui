<!--
  Dropdown component for selecting a filter operator
  Displays available operators for the given field type
  Highlights the currently selected operator
-->
<template>
  <UDropdownMenu
    :items="dropdownItems"
    :size="context.size"
    :ui="{
      content: 'w-fit min-w-fit',
      item: 'text-sm'
    }"
    @select="handleSelect"
  >
    <UButton
      :color="context.variant === 'solid' ? 'neutral' : 'neutral'"
      :variant="context.variant === 'solid' ? 'subtle' : 'outline'"
      :size="context.size"
      class="rounded-none whitespace-nowrap"
      :ui="{
        label: 'whitespace-nowrap'
      }"
    >
      {{ operatorLabel }}
      <template #trailing>
        <UIcon
          name="i-lucide-chevron-down"
          class="h-4 w-4 opacity-60 shrink-0"
        />
      </template>
    </UButton>

    <template #item-trailing="{ item }">
      <UIcon
        v-if="item.value === operator"
        name="i-lucide-check"
        class="ml-auto text-primary"
      />
    </template>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { FilterFieldConfig, FilterOperatorValue } from '../../types/filter'
import { useFilterContext } from '../../composables/useFilterContext'
import { computed } from 'vue'
import { getOperatorsForFieldType } from '../../utils/operators'
import type { DropdownMenuItem } from '../../types'
import UButton from '../Button.vue'
import UIcon from '../Icon.vue'
import UDropdownMenu from '../DropdownMenu.vue'

interface Props {
  field: FilterFieldConfig
  operator: FilterOperatorValue
  values: unknown[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  change: [operator: FilterOperatorValue]
}>()

const context = useFilterContext()

// Gets available operators for field type
const operators = computed(() => {
  if (!props.field.type) {
    return []
  }
  return getOperatorsForFieldType(props.field.type, props.field.operators)
})

// Calculates current operator label for display
const operatorLabel = computed(() => {
  const op = operators.value.find(o => o.value === props.operator)
  if (op) {
    return op.label
  }
  return context.i18n.helpers.formatOperator(props.operator)
})

// Builds dropdown menu items from available operators
const dropdownItems = computed<DropdownMenuItem[]>(() => {
  return operators.value.map(op => ({
    label: op.label,
    value: op.value,
    onSelect: () => {
      emit('change', op.value as FilterOperatorValue)
    }
  }))
})

/**
 * Handles operator selection in the dropdown
 */
function handleSelect(item: DropdownMenuItem | DropdownMenuItem[]) {
  const selectedItem = Array.isArray(item) ? item[0] : item
  if (selectedItem?.value) {
    emit('change', selectedItem.value as FilterOperatorValue)
  }
}
</script>
