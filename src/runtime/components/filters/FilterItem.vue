<!--
  Component representing an individual active filter
  Displays the field, operator and value selector in a styled field group
  Allows filter modification and removal
-->
<template>
  <UFieldGroup
    :size="context.size"
    :class="filterItemClasses"
    data-slot="filter-item"
  >
    <!-- Field Label Badge -->
    <UBadge
      :color="context.variant === 'solid' ? 'neutral' : 'neutral'"
      :variant="context.variant === 'solid' ? 'subtle' : 'outline'"
      :size="getBadgeSize(context.size)"
      :class="[
        'rounded-s-md',
        context.radius === 'full' ? 'rounded-s-full' : '',
        'justify-start whitespace-nowrap'
      ]"
      :ui="{
        label: 'whitespace-nowrap'
      }"
      :icon="field?.icon && typeof field.icon === 'string' ? field.icon : undefined"
    >
      {{ field?.label || filter.field }}
    </UBadge>

    <!-- Operator Dropdown -->
    <FilterOperatorDropdown
      v-if="field"
      :field="field"
      :operator="filter.operator"
      :values="filter.values"
      @change="(op: FilterOperatorValue) => $emit('update', { operator: op })"
    />

    <!-- Value Selector -->
    <FilterValueSelector
      v-if="field"
      :field="field"
      :values="filter.values"
      :operator="filter.operator"
      @change="(vals) => $emit('update', { values: vals })"
    />

    <!-- Remove Button -->
    <UButton
      :color="context.variant === 'solid' ? 'neutral' : 'neutral'"
      :variant="context.variant === 'solid' ? 'subtle' : 'outline'"
      :size="context.size"
      :class="[
        'rounded-e-md',
        context.radius === 'full' ? 'rounded-e-full' : ''
      ]"
      icon="i-lucide-x"
      square
      @click="$emit('remove')"
    />
  </UFieldGroup>
</template>

<script setup lang="ts">
import type { Filter, FilterFieldConfig, FilterOperatorValue } from '../../types/filter'
import { useFilterContext } from '../../composables/useFilterContext'
import { computed } from 'vue'
import { getBadgeSize } from '../../utils/operators'
import FilterOperatorDropdown from './FilterOperatorDropdown.vue'
import FilterValueSelector from './FilterValueSelector.vue'
import UButton from '../Button.vue'
import UBadge from '../Badge.vue'
import UFieldGroup from '../FieldGroup.vue'

interface Props {
  filter: Filter
  field?: FilterFieldConfig
}

defineProps<Props>()

defineEmits<{
  update: [updates: Partial<Filter>]
  remove: []
}>()

const context = useFilterContext()

// Calculates CSS classes for the filter container based on variant
const filterItemClasses = computed(() => {
  const base = 'shadow-xs shadow-black/5'
  const gap = context.variant === 'solid' ? '' : ''
  return [base, gap].filter(Boolean).join(' ')
})
</script>
