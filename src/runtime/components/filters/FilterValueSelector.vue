<!--
  Smart value selector component for a filter
  Automatically selects the correct input component based on field type and operator
  Supports all field types: text, number, date, select, boolean, etc.
  Handles special cases like ranges (between/not_between) and operators without values (empty/not_empty)
-->
<template>
  <!-- Hide value input for empty/not_empty operators -->
  <template v-if="operator !== 'empty' && operator !== 'not_empty'">
    <!-- Custom renderer -->
    <component
      :is="field.customRenderer"
      v-if="field.customRenderer"
      :field="field"
      :values="values"
      :operator="operator"
      @change="(vals: unknown[]) => $emit('change', vals)"
    />

    <!-- Boolean -->
    <UButton
      v-else-if="field.type === 'boolean'"
      :color="context.variant === 'solid' ? 'neutral' : 'neutral'"
      :variant="context.variant === 'solid' ? 'subtle' : 'outline'"
      :size="context.size"
      class="rounded-none"
      disabled
    >
      <USwitch
        :model-value="values[0] === true"
        size="xs"
        @update:model-value="(checked: boolean) => $emit('change', [checked])"
        @click.stop
      />
      <span
        v-if="field.onLabel && field.offLabel"
        class="text-xs text-muted-foreground ml-2"
      >
        {{ values[0] === true ? field.onLabel : field.offLabel }}
      </span>
    </UButton>

    <!-- Select/Multiselect -->
    <USelectMenu
      v-else-if="field.type === 'select' || field.type === 'multiselect'"
      :model-value="selectedItems"
      :items="selectItems"
      :placeholder="field.placeholder || context.i18n.select"
      :size="context.size"
      :search-input="field.searchable !== false"
      :multiple="field.type === 'multiselect'"
      class="rounded-none"
      @update:model-value="handleSelectUpdate"
    />

    <!-- Use FilterNumberRange for number with between/not_between operators -->
    <FilterNumberRange
      v-else-if="field.type === 'number' && (operator === 'between' || operator === 'not_between')"
      :model-value="getNumberRangeValue()"
      :size="context.size"
      :variant="context.variant === 'solid' ? 'outline' : 'outline'"
      :min="field.min"
      :max="field.max"
      :step="field.step"
      :min-label="context.i18n.min"
      :max-label="context.i18n.max"
      :to-label="context.i18n.toAlt"
      class="rounded-none"
      @update:model-value="handleNumberRangeUpdate"
    />

    <!-- Use FilterTimeRange for time with between/not_between operators -->
    <FilterTimeRange
      v-else-if="field.type === 'time' && (operator === 'between' || operator === 'not_between')"
      :model-value="getDateRangeValue()"
      :size="context.size"
      :variant="context.variant === 'solid' ? 'outline' : 'outline'"
      :to-label="context.i18n.toAlt"
      class="rounded-none"
      @update:model-value="handleDateRangeUpdate"
    />

    <!-- Use FilterDateTimeRange for datetime with between/not_between operators -->
    <FilterDateTimeRange
      v-else-if="field.type === 'datetime' && (operator === 'between' || operator === 'not_between')"
      :model-value="getDateRangeValue()"
      :size="context.size"
      :variant="context.variant === 'solid' ? 'outline' : 'outline'"
      :to-label="context.i18n.toAlt"
      class="rounded-none"
      @update:model-value="handleDateRangeUpdate"
    />

    <!-- Use UInput directly for simple types (except date, time, datetime and number with range operators) -->
    <UTooltip
      v-else-if="['text', 'number', 'email', 'url', 'tel', 'time', 'datetime'].includes(field.type || '')"
      :open="shouldShowTooltip"
      :text="validationError || ''"
      :disabled="!validationError"
      :content="{ side: 'top' }"
    >
      <UInput
        :model-value="getSingleValue() || ''"
        :type="getInputType()"
        :placeholder="field.placeholder || context.i18n.placeholders.enterValue"
        :size="context.size"
        :variant="context.variant === 'solid' ? 'outline' : 'outline'"
        :color="validationError ? 'error' : undefined"
        :highlight="!!validationError"
        class="rounded-none"
        :ui="{
          base: 'rounded-none'
        }"
        @update:model-value="handleSingleValueUpdate"
        @focus="isInputFocused = true"
        @blur="isInputFocused = false"
        @mouseenter="isInputHovered = true"
        @mouseleave="isInputHovered = false"
      />
    </UTooltip>

    <!-- Use FilterDateRange for date with between/not_between operators -->
    <FilterDateRange
      v-else-if="field.type === 'date' && (operator === 'between' || operator === 'not_between')"
      :model-value="getDateRangeValue()"
      :size="context.size"
      :variant="context.variant === 'solid' ? 'outline' : 'outline'"
      :to-label="context.i18n.toAlt"
      class="rounded-none"
      @update:model-value="handleDateRangeUpdate"
    />

    <!-- Use FilterDatePicker for date (single date) -->
    <UTooltip
      v-else-if="field.type === 'date'"
      :open="shouldShowTooltip"
      :text="validationError || ''"
      :disabled="!validationError"
      :content="{ side: 'top' }"
    >
      <div
        @focusin="isInputFocused = true"
        @focusout="isInputFocused = false"
        @mouseenter="isInputHovered = true"
        @mouseleave="isInputHovered = false"
      >
        <FilterDatePicker
          :model-value="dateValue"
          :size="context.size"
          :variant="context.variant === 'solid' ? 'outline' : 'outline'"
          :placeholder="field.placeholder || context.i18n.placeholders.selectField"
          class="rounded-none"
          :class="{ 'ring-2 ring-error': validationError }"
          @update:model-value="handleSingleValueUpdate"
        />
      </div>
    </UTooltip>
  </template>
</template>

<script setup lang="ts">
import type { FilterFieldConfig, FilterOperatorValue } from '../../types/filter'
import { useFilterContext } from '../../composables/useFilterContext'
import { ref, computed, watch, nextTick } from 'vue'
import { validateFilterValue, validateEmail, validateUrl, validateTel } from '../../utils/validation'
import FilterDateRange from './FilterDateRange.vue'
import FilterDateTimeRange from './FilterDateTimeRange.vue'
import FilterTimeRange from './FilterTimeRange.vue'
import FilterNumberRange from './FilterNumberRange.vue'
import FilterDatePicker from './FilterDatePicker.vue'
import UButton from '../Button.vue'
import USwitch from '../Switch.vue'
import USelectMenu from '../SelectMenu.vue'
import UTooltip from '../Tooltip.vue'
import UInput from '../Input.vue'

interface Props {
  field: FilterFieldConfig
  values: unknown[]
  operator: FilterOperatorValue
}

const props = defineProps<Props>()

const emit = defineEmits<{
  change: [values: unknown[]]
}>()

const context = useFilterContext()

// State for validation errors
const validationError = ref<string | null>(null)

// State to track input focus and hover
const isInputFocused = ref(false)
const isInputHovered = ref(false)

// Computed to determine if tooltip should be open
const shouldShowTooltip = computed(() => {
  return !!validationError.value && (isInputFocused.value || isInputHovered.value)
})

/**
 * Determines the HTML input type to use based on field type
 */
function getInputType(): 'text' | 'email' | 'url' | 'tel' | 'date' | 'time' | 'datetime-local' | 'number' {
  if (!props.field.type) {
    return 'text'
  }
  if (props.field.type === 'datetime') {
    return 'datetime-local'
  }
  return props.field.type as 'text' | 'email' | 'url' | 'tel' | 'date' | 'time' | 'datetime-local' | 'number'
}

/**
 * Extracts the first value from the values array (for simple inputs)
 */
function getSingleValue(): string | number | null {
  if (props.values.length === 0) {
    return null
  }
  return props.values[0] as string | number
}

/**
 * Determines if the operator requires strict validation (complete value)
 * Partial search operators (contains, starts_with, etc.) don't require strict validation
 */
function requiresStrictValidation(): boolean {
  const partialOperators: FilterOperatorValue[] = [
    'contains',
    'not_contains',
    'starts_with',
    'ends_with',
    'greater_than',
    'less_than',
    'before',
    'after'
  ]
  return !partialOperators.includes(props.operator)
}

/**
 * Validates a value according to field type and configuration
 * @param value - Value to validate
 * @returns true if value is valid, false otherwise
 */
function validateValue(value: string | number | null): boolean {
  // Reset error at start
  validationError.value = null

  if (value === null || value === '') {
    return true
  }

  const stringValue = String(value)

  // Automatic validation based on field type (only for operators requiring strict validation)
  if (requiresStrictValidation()) {
    if (props.field.type === 'email') {
      if (!validateEmail(stringValue)) {
        const errorMsg = context.i18n?.validation?.invalidEmail || 'Invalid email format'
        validationError.value = errorMsg
        return false
      }
    } else if (props.field.type === 'url') {
      if (!validateUrl(stringValue)) {
        const errorMsg = context.i18n?.validation?.invalidUrl || 'Invalid URL format'
        validationError.value = errorMsg
        return false
      }
    } else if (props.field.type === 'tel') {
      if (!validateTel(stringValue)) {
        const errorMsg = context.i18n?.validation?.invalidTel || 'Invalid phone format'
        validationError.value = errorMsg
        return false
      }
    }
  }

  // Validation with pattern or custom function (only if defined)
  // For partial operators, we still validate the pattern if defined
  // as it can be useful to validate allowed characters even in a partial search
  if (props.field.pattern || props.field.validation) {
    const validationResult = validateFilterValue(value, props.field.pattern, props.field.validation)
    if (!validationResult.isValid) {
      // Use custom error message if provided, otherwise use default message
      const errorMsg = validationResult.errorMessage || context.i18n?.validation?.invalid || 'Invalid input format'
      validationError.value = errorMsg
      return false
    }
  }

  return true
}

/**
 * Handles update of a simple value (non-range)
 * Validates the value and displays errors, but always emits the value to keep synchronization
 */
function handleSingleValueUpdate(value: string | number | null) {
  if (value === null || value === '') {
    validationError.value = null
    emit('change', [])
    return
  }

  // Validate value immediately on input
  validateValue(value)

  // Emit value even if invalid to keep synchronization
  // Parent can use validateFilter() to check validity
  emit('change', [value])
}

// Builds items for select/multiselect components
const selectItems = computed(() => {
  return props.field.options?.map(opt => ({
    label: opt.label,
    value: opt.value,
    icon: typeof opt.icon === 'string' ? opt.icon : undefined
  })) || []
})

// Determines selected items for select/multiselect components
const selectedItems = computed(() => {
  if (props.field.type === 'multiselect') {
    return selectItems.value.filter(item => props.values.includes(item.value as string | number))
  }
  if (props.values.length > 0) {
    return selectItems.value.find(item => item.value === props.values[0])
  }
  return undefined
})

/**
 * Handles selection update for select/multiselect fields
 */
function handleSelectUpdate(item: { label: string, value: unknown } | { label: string, value: unknown }[] | undefined) {
  if (!item) {
    emit('change', [])
    return
  }
  if (Array.isArray(item)) {
    emit('change', item.map(i => i.value))
  } else {
    emit('change', [item.value])
  }
}

/**
 * Extracts range values for date/datetime/time types
 */
function getDateRangeValue(): [string | null, string | null] {
  if (props.values.length < 2) {
    return [null, null]
  }
  return [
    props.values[0] as string | null,
    props.values[1] as string | null
  ]
}

/**
 * Extracts range values for number type
 */
function getNumberRangeValue(): [number | null, number | null] {
  if (props.values.length < 2) {
    return [null, null]
  }
  return [
    props.values[0] as number | null,
    props.values[1] as number | null
  ]
}

/**
 * Handles update of a date/datetime/time range
 * Preserves tuple structure even with null values to maintain reactivity
 */
function handleDateRangeUpdate(value: [string | null, string | null]) {
  // Don't filter null values to maintain tuple structure
  // Otherwise reactivity is broken as we go from [val, null] to [val] then to [val, val2]
  emit('change', [value[0] || '', value[1] || ''])
}

/**
 * Handles update of a number range
 * Filters null values to keep only defined values
 */
function handleNumberRangeUpdate(value: [number | null, number | null]) {
  emit('change', value.filter(v => v !== null))
}

// Date value for FilterDatePicker (returns string | null)
const dateValue = computed(() => {
  const value = getSingleValue()
  return value === null ? null : String(value)
})

// Validate existing value on load and when it changes
watch(
  () => props.values,
  () => {
    // Use nextTick to ensure context is available
    nextTick(() => {
      const value = getSingleValue()
      validateValue(value)
    })
  },
  { immediate: true, deep: true }
)

// Revalidate when field changes (to account for pattern/validation changes)
watch(
  () => [props.field.pattern, props.field.validation, props.field.type],
  () => {
    nextTick(() => {
      const value = getSingleValue()
      if (value !== null && value !== '') {
        validateValue(value)
      }
    })
  },
  { deep: true }
)

// Revalidate when operator changes (as validation depends on operator)
watch(
  () => props.operator,
  () => {
    nextTick(() => {
      const value = getSingleValue()
      if (value !== null && value !== '') {
        validateValue(value)
      } else {
        validationError.value = null
      }
    })
  }
)
</script>
