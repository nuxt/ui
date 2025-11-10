<!-- eslint-disable vue/multi-word-component-names -->
<!--
  Main component of the filter system
  Manages the display and manipulation of a list of active filters
  Provides a shared context to all child components via FilterContextProvider
-->
<template>
  <FilterContextProvider
    :variant="variant"
    :size="size"
    :radius="radius"
    :i18n="mergedI18n"
    :cursor-pointer="cursorPointer"
    :class-name="className"
    :show-add-button="showAddButton"
    :add-button-text="addButtonText"
    :add-button-icon="addButtonIcon"
    :add-button-class-name="addButtonClassName"
    :add-button="addButton"
    :show-search-input="showSearchInput"
    :trigger="trigger"
    :allow-multiple="allowMultiple"
  >
    <div :class="containerClasses">
      <!-- Filtres actifs -->
      <FilterItem
        v-for="filter in filters"
        :key="filter.id"
        :filter="filter"
        :field="fieldsMap[filter.field]"
        @update="(updates: Partial<Filter>) => updateFilter(filter.id, updates)"
        @remove="removeFilter(filter.id)"
      />

      <!-- Bouton ajouter filtre -->
      <AddFilterPopover
        v-if="showAddButton && selectableFields.length > 0"
        :fields="fields"
        :filters="filters"
        :allow-multiple="allowMultiple"
        @add-filter="handleAddFilter"
        @update-filter="updateFilter"
      />
    </div>
  </FilterContextProvider>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type {
  Filter,
  FilterFieldsConfig,
  FilterFieldConfig,
  FilterI18nConfig,
  FiltersVariant,
  FiltersSize,
  FiltersRadius,
  FilterOperatorValue
} from '../types/filter'
import { computed } from 'vue'
import { mergeI18nConfig } from '../utils/operators'
import { flattenFieldsConfig, getFieldsMap } from '../utils/fields'
import FilterContextProvider from './filters/FilterContextProvider.vue'
import FilterItem from './filters/FilterItem.vue'
import AddFilterPopover from './filters/AddFilterPopover.vue'

interface Props {
  filters?: Filter[]
  fields: FilterFieldsConfig
  onChange?: (filters: Filter[]) => void
  className?: string
  showAddButton?: boolean
  addButtonText?: string
  addButtonIcon?: string
  addButtonClassName?: string
  addButton?: Component
  variant?: FiltersVariant
  size?: FiltersSize
  radius?: FiltersRadius
  i18n?: Partial<FilterI18nConfig>
  showSearchInput?: boolean
  cursorPointer?: boolean
  trigger?: Component
  allowMultiple?: boolean
  popoverContentClassName?: string
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => [],
  onChange: undefined,
  className: '',
  showAddButton: true,
  addButtonText: 'Add filter',
  addButtonIcon: 'lucide:list-filter-plus',
  addButtonClassName: '',
  addButton: undefined,
  variant: 'outline',
  size: 'sm',
  radius: 'md',
  i18n: () => ({}),
  showSearchInput: true,
  cursorPointer: true,
  trigger: undefined,
  allowMultiple: true,
  popoverContentClassName: ''
})

const emit = defineEmits<{
  change: [filters: Filter[]]
}>()

// Merges custom i18n configuration with default values
const mergedI18n = computed(() => mergeI18nConfig(props.i18n))

// Creates a map of fields for quick access by key
const fieldsMap = computed(() => getFieldsMap(props.fields))

// Calculates CSS classes for the container based on variant and size
const containerClasses = computed(() => {
  const base = 'flex flex-wrap items-center'
  const gap = props.variant === 'solid' ? 'gap-2' : props.size === 'sm' ? 'gap-1.5' : props.size === 'lg' ? 'gap-3.5' : 'gap-2.5'
  return [base, gap, props.className].filter(Boolean).join(' ')
})

// Determines which fields can be selected to create a new filter
// Excludes separators and already used fields if allowMultiple is false
const selectableFields = computed(() => {
  const flatFields = flattenFieldsConfig(props.fields)
  return flatFields.filter((field) => {
    if (!field.key || field.type === 'separator') {
      return false
    }
    if (props.allowMultiple) {
      return true
    }
    return !props.filters.some(filter => filter.field === field.key)
  })
})

/**
 * Generates a unique identifier for a filter
 * Combines timestamp and random string to ensure uniqueness
 * @returns Unique identifier in format "filter-{timestamp}-{random}"
 */
function generateFilterId(): string {
  return `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Updates an existing filter with new values
 * Automatically clears values for empty/not_empty operators
 */
function updateFilter(filterId: string, updates: Partial<Filter>) {
  const updatedFilters = props.filters.map(f =>
    f.id === filterId ? { ...f, ...updates } : f
  )
  // Clear values for empty/not_empty operators
  if (updates.operator === 'empty' || updates.operator === 'not_empty') {
    const filterIndex = updatedFilters.findIndex(f => f.id === filterId)
    if (filterIndex >= 0 && updatedFilters[filterIndex]) {
      updatedFilters[filterIndex].values = []
    }
  }
  emit('change', updatedFilters)
  props.onChange?.(updatedFilters)
}

/**
 * Removes a filter from the list
 */
function removeFilter(filterId: string) {
  const updatedFilters = props.filters.filter(f => f.id !== filterId)
  emit('change', updatedFilters)
  props.onChange?.(updatedFilters)
}

/**
 * Adds a new filter to the list
 * Automatically determines the operator and default values based on field type
 * @param fieldKey - Key of the field to add
 * @param operator - Operator to use (default: field's default operator)
 * @param values - Values to use (default: field's default values)
 * @param callback - Function called with the created filter ID (for real-time updates)
 */
function handleAddFilter(fieldKey: string, operator?: FilterOperatorValue, values: unknown[] = [], callback?: (filterId: string) => void) {
  const field = fieldsMap.value[fieldKey]
  if (!field?.key) {
    return
  }

  const defaultOperator = operator || field.defaultOperator || getDefaultOperatorForField(field)
  const defaultValues = values.length > 0 ? values : getDefaultValuesForField(field)

  const newFilter: Filter = {
    id: generateFilterId(),
    field: field.key,
    operator: defaultOperator,
    values: defaultValues
  }

  const updatedFilters = [...props.filters, newFilter]
  emit('change', updatedFilters)
  props.onChange?.(updatedFilters)

  // Call the callback with the created filter ID
  if (callback) {
    callback(newFilter.id)
  }
}

/**
 * Determines the default operator for a given field
 * For booleans, always returns 'is'
 */
function getDefaultOperatorForField(field: FilterFieldConfig): FilterOperatorValue {
  if (field.type === 'boolean') {
    return 'is'
  }
  return 'is'
}

/**
 * Determines default values for a field based on its type
 * Handles special cases for ranges (between/not_between) and specific types
 */
function getDefaultValuesForField(field: FilterFieldConfig): unknown[] {
  if (['text', 'email', 'url', 'tel'].includes(field.type || '')) {
    return ['']
  }
  if (field.type === 'number') {
    // If default operator is 'between' or 'not_between', return a range
    const defaultOp = field.defaultOperator || getDefaultOperatorForField(field)
    if (defaultOp === 'between' || defaultOp === 'not_between') {
      return [field.min || 0, field.max || 100]
    }
    return ['']
  }
  if (field.type === 'date') {
    // If default operator is 'between' or 'not_between', return a range
    const defaultOp = field.defaultOperator || getDefaultOperatorForField(field)
    if (defaultOp === 'between' || defaultOp === 'not_between') {
      return ['', '']
    }
    return ['']
  }
  if (field.type === 'datetime') {
    // If default operator is 'between' or 'not_between', return a range
    const defaultOp = field.defaultOperator || getDefaultOperatorForField(field)
    if (defaultOp === 'between' || defaultOp === 'not_between') {
      return ['', '']
    }
    return ['']
  }
  if (field.type === 'time') {
    // If default operator is 'between' or 'not_between', return a range
    const defaultOp = field.defaultOperator || getDefaultOperatorForField(field)
    if (defaultOp === 'between' || defaultOp === 'not_between') {
      return ['', '']
    }
    return ['']
  }
  if (field.type === 'boolean') {
    return [false]
  }
  return []
}
</script>
