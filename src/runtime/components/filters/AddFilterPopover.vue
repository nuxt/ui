<!--
  Complex component managing the addition of new filters via a nested popover system
  Supports hierarchical navigation in fields with children
  Manages field, operator and value selection via multiple coordinated popovers
-->
<template>
  <div class="relative">
    <!-- Main popover for field selection -->
    <UPopover
      v-model:open="isOpen"
      :content="{
        side: 'bottom',
        align: 'start',
        sideOffset: 8,
        collisionPadding: 20,
        avoidCollisions: true,
        disableUpdateOnLayoutShift: true
      }"
      @update:open="handleMainPopoverClose"
    >
      <template #default>
        <UButton
          v-if="!context.addButton"
          :icon="context.addButtonIcon || 'lucide:list-filter-plus'"
          :variant="areFiltersSet ? 'outline' : 'solid'"
          :size="context.size"
          :class="[
            context.radius === 'full' ? 'rounded-full' : 'rounded-md',
            context.addButtonClassName,
            'h-full'
          ]"
          :style="{ marginTop: '1px' /* Button is slightly higher than the filters */ }"
          :ui="{
            base: 'font-medium'
          }"
        >
          {{ areFiltersSet ? '' : (context.addButtonText || context.i18n.addFilter) }}
        </UButton>
        <component
          :is="context.addButton"
          v-else-if="context.addButton"
          @click="isOpen = true"
        />
      </template>

      <template #content>
        <div
          ref="mainPopoverContentRef"
          class="w-[200px] p-0"
        >
          <UCommandPalette
            v-model="selectedFieldItem"
            virtualize
            :fuse="{ resultLimit: 1000 /* NOTE: This is a hack because the is a default limit of 12 items */ }"
            :groups="fieldGroups"
            :placeholder="context.i18n.searchFields"
            selected-icon="lucide:dot"
            :ui="{
              input: '[&>input]:h-8 [&>input]:text-sm'
            }"
            @update:model-value="handleFieldSelect"
            @highlight="handleHighlight"
          >
            <template #empty>
              <div class="py-4 text-center text-sm text-gray-500">
                {{ context.i18n.noFieldsFound }}
              </div>
            </template>

            <!-- Show chevron icon for fields with options -->
            <template #item-trailing="{ item }">
              <UIcon
                v-if="hasOptions(item.id)"
                name="i-lucide-chevron-right"
                class="ml-auto h-4 w-4 opacity-60"
              />
            </template>
          </UCommandPalette>
        </div>
      </template>
    </UPopover>

    <!-- Nested navigation popovers for fields with children -->
    <UPopover
      v-for="(level, index) in fieldNavigationStack"
      :key="`field-navigation-${index}-${level.parent.key}`"
      :open="true"
      :reference="level.reference"
      :content="{
        side: 'right',
        align: 'start',
        sideOffset: 8,
        collisionPadding: 20,
        avoidCollisions: true,
        disableUpdateOnLayoutShift: true
      }"
    >
      <template #content>
        <div class="w-[200px] p-0">
          <UCommandPalette
            v-model="level.selectedItem"
            virtualize
            :fuse="{ resultLimit: 1000 /* NOTE: This is a hack because the is a default limit of 12 items */ }"
            :groups="getFieldPaletteGroupsForFields(level.fields)"
            :placeholder="context.i18n.searchFields"
            selected-icon="lucide:dot"
            :ui="{
              input: '[&>input]:h-8 [&>input]:text-sm'
            }"
            @update:model-value="(item) => handleNestedFieldSelect(index, item)"
            @highlight="(highlighted) => handleNestedHighlight(index, highlighted)"
          >
            <template #empty>
              <div class="py-4 text-center text-sm text-gray-500">
                {{ context.i18n.noFieldsFound }}
              </div>
            </template>

            <template #item-trailing="{ item }">
              <UIcon
                v-if="hasOptions(item.id)"
                name="i-lucide-chevron-right"
                class="ml-auto h-4 w-4 opacity-60"
              />
            </template>
          </UCommandPalette>
        </div>
      </template>
    </UPopover>

    <!-- Nested popover for option selection (opens to the right) -->
    <UPopover
      v-if="selectedField && isOptionsPopoverOpen"
      :open="isOptionsPopoverOpen"
      :reference="optionsPopoverReference"
      :content="{
        side: 'right',
        align: 'start',
        sideOffset: 8,
        collisionPadding: 20,
        avoidCollisions: true,
        disableUpdateOnLayoutShift: true
      }"
      @update:open="handleNestedPopoverClose"
    >
      <template #content>
        <div class="w-[200px] p-0">
          <SelectOptionsPopover
            :field="selectedField"
            :values="tempValues"
            @change="handleSelectChange"
            @close="handleClose"
          />
        </div>
      </template>
    </UPopover>
  </div>
</template>

<script setup lang="ts">
import type { FilterFieldsConfig, FilterFieldConfig, Filter, FilterOperatorValue } from '../../types/filter'
import type { CommandPaletteItem } from '../../types'
import { useFilterContext } from '../../composables/useFilterContext'
import { ref, computed, nextTick } from 'vue'
import { collectAllFields, getFieldGroups, hasGroups } from '../../utils/fields'
import { getDefaultOperatorForFieldType } from '../../utils/operators'
import SelectOptionsPopover from './SelectOptionsPopover.vue'
import UButton from '../Button.vue'
import UCommandPalette from '../CommandPalette.vue'
import UIcon from '../Icon.vue'
import UPopover from '../Popover.vue'

interface Props {
  fields: FilterFieldsConfig
  filters: Filter[]
  allowMultiple: boolean
}

interface FieldNavigationLevel {
  parent: FilterFieldConfig
  fields: FilterFieldConfig[]
  anchor: HTMLElement | null
  reference?: { getBoundingClientRect: () => DOMRect }
  selectedItem?: CommandPaletteItem | CommandPaletteItem[]
  lastHighlightRef?: HTMLElement | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  addFilter: [fieldKey: string, operator?: FilterOperatorValue, values?: unknown[], callback?: (filterId: string) => void]
  updateFilter: [filterId: string, updates: Partial<Filter>]
}>()

const context = useFilterContext()
const isOpen = ref(false)
const selectedFieldItem = ref<CommandPaletteItem | CommandPaletteItem[]>()
const selectedField = ref<FilterFieldConfig | null>(null)
const tempValues = ref<unknown[]>([])
const isOptionsPopoverOpen = ref(false)
const highlightedItemRef = ref<HTMLElement | null>(null)
const mainPopoverContentRef = ref<HTMLElement | null>(null)
const isCreatingNewFilter = ref(true)
const currentFilterId = ref<string | null>(null)
// Navigation stack to manage nested field levels
const fieldNavigationStack = ref<FieldNavigationLevel[]>([])

const areFiltersSet = computed(() => {
  return props.filters.length > 0
})

// Calculates the reference for positioning the options popover
const optionsPopoverReference = computed(() => {
  const refElement = highlightedItemRef.value || mainPopoverContentRef.value
  if (!refElement) {
    return undefined
  }
  return {
    getBoundingClientRect: () => refElement.getBoundingClientRect()
  }
})

const allFieldsMap = computed<Record<string, FilterFieldConfig>>(() => {
  const map: Record<string, FilterFieldConfig> = {}
  collectAllFields(props.fields).forEach((field) => {
    if (field.key) {
      map[field.key] = field
    }
  })
  return map
})

/**
 * Checks if a field has children (hierarchical navigation)
 */
function fieldHasChildren(field: FilterFieldConfig | undefined): boolean {
  return Boolean(field && field.children && field.children.length > 0)
}

/**
 * Determines if a field can be selected to create a filter
 * Checks if the field is not already used (if allowMultiple is false)
 */
function isFieldSelectable(field: FilterFieldConfig): boolean {
  if (!field.key || !field.type) {
    return false
  }
  if (props.allowMultiple) {
    return true
  }
  return !props.filters.some(filter => filter.field === field.key)
}

/**
 * Builds command palette items from a list of fields
 * Manages disabled state for non-selectable fields
 */
function buildPaletteItems(fields: FilterFieldConfig[]): CommandPaletteItem[] {
  const items: CommandPaletteItem[] = []
  for (const field of fields) {
    if (!field.key) {
      continue
    }
    const hasChildren = fieldHasChildren(field)
    const disabled = !hasChildren && !isFieldSelectable(field)
    if (disabled && !hasChildren) {
      continue
    }
    items.push({
      id: field.key,
      label: field.label,
      icon: typeof field.icon === 'string' ? field.icon : undefined,
      disabled
    })
  }
  return items
}

/**
 * Creates palette groups for a given list of fields
 */
function getFieldPaletteGroupsForFields(fields: FilterFieldConfig[]) {
  const items = buildPaletteItems(fields)
  return items.length > 0
    ? [{ id: 'fields', items }]
    : []
}

const fieldGroups = computed(() => {
  if (hasGroups(props.fields)) {
    return getFieldGroups(props.fields)
      .map((group) => {
        const items = buildPaletteItems(group.fields)
        if (items.length === 0) {
          return null
        }
        return {
          id: group.group,
          label: group.group,
          items
        }
      })
      .filter((group): group is { id: string, label: string, items: CommandPaletteItem[] } => group !== null)
  }

  const rootFields = Array.isArray(props.fields) ? (props.fields as FilterFieldConfig[]) : []
  const items = buildPaletteItems(rootFields)
  return items.length > 0 ? [{ id: 'fields', items }] : []
})

/**
 * Checks if a field has options to select (select/multiselect) or children
 */
function hasOptions(fieldKey: string | undefined): boolean {
  if (!fieldKey) {
    return false
  }
  const field = allFieldsMap.value[fieldKey]
  if (!field) {
    return false
  }
  if (fieldHasChildren(field)) {
    return true
  }
  return field.type === 'select' || field.type === 'multiselect'
}

/**
 * Creates a reference for popover positioning
 */
function createReference(anchor: HTMLElement | null) {
  if (!anchor) {
    return undefined
  }
  return {
    getBoundingClientRect: () => anchor.getBoundingClientRect()
  }
}

/**
 * Opens a new navigation level for child fields
 * Manages the navigation stack to enable hierarchical navigation
 */
function openFieldNavigationLevel(levelIndex: number, parentField: FilterFieldConfig, anchor: HTMLElement | null) {
  const children = (parentField.children ?? []).filter((child) => {
    return fieldHasChildren(child) || isFieldSelectable(child)
  })

  if (children.length === 0) {
    closeFieldNavigationLevels(levelIndex)
    return
  }

  const newLevel: FieldNavigationLevel = {
    parent: parentField,
    fields: children,
    anchor,
    reference: createReference(anchor),
    selectedItem: undefined,
    lastHighlightRef: null
  }

  const truncatedStack = fieldNavigationStack.value.slice(0, levelIndex) as FieldNavigationLevel[]
  truncatedStack.push(newLevel)
  fieldNavigationStack.value = truncatedStack
  isCreatingNewFilter.value = true
  currentFilterId.value = null
}

/**
 * Closes navigation levels from a given index
 */
function closeFieldNavigationLevels(startIndex: number) {
  if (fieldNavigationStack.value.length > startIndex) {
    fieldNavigationStack.value = fieldNavigationStack.value.slice(0, startIndex)
  }
}

/**
 * Handles hovering over a field in the palette
 * Automatically opens navigation or options popovers based on field type
 */
function handleFieldHighlighted(field: FilterFieldConfig, anchor: HTMLElement | null, nextLevelIndex: number) {
  if (fieldHasChildren(field)) {
    openFieldNavigationLevel(nextLevelIndex, field, anchor)
    highlightedItemRef.value = anchor
    isOptionsPopoverOpen.value = false
    selectedField.value = null
    return
  }

  closeFieldNavigationLevels(nextLevelIndex)
  highlightedItemRef.value = anchor

  if (!field.type) {
    selectedField.value = null
    isOptionsPopoverOpen.value = false
    return
  }

  if (!isFieldSelectable(field) && currentFilterId.value === null) {
    selectedField.value = null
    isOptionsPopoverOpen.value = false
    return
  }

  if (field.type === 'select' || field.type === 'multiselect') {
    selectedField.value = field
    let existingFilter: Filter | undefined
    if (!isCreatingNewFilter.value) {
      if (currentFilterId.value) {
        existingFilter = props.filters.find(filter => filter.id === currentFilterId.value)
      }
      if (!existingFilter) {
        existingFilter = props.filters.find(filter => filter.field === field.key)
      }
    }
    tempValues.value = field.type === 'multiselect' && existingFilter ? existingFilter.values : []
    nextTick(() => {
      isOptionsPopoverOpen.value = true
    })
  } else {
    selectedField.value = null
    isOptionsPopoverOpen.value = false
  }
}

/**
 * Handles field selection in the main palette
 */
function handleFieldSelect(item: CommandPaletteItem | CommandPaletteItem[]) {
  const selectedItem = Array.isArray(item) ? item[0] : item
  if (!selectedItem || !selectedItem.id) {
    return
  }
  const field = allFieldsMap.value[selectedItem.id]
  if (!field) {
    return
  }

  const anchor = highlightedItemRef.value || mainPopoverContentRef.value

  if (fieldHasChildren(field)) {
    openFieldNavigationLevel(0, field, anchor)
    return
  }

  if (!isFieldSelectable(field) && currentFilterId.value === null) {
    return
  }

  handleFieldSelectInternal(field)
}

/**
 * Handles hovering in the main palette
 */
function handleHighlight(highlighted: { ref: HTMLElement, value: CommandPaletteItem } | undefined) {
  if (!highlighted) {
    closeFieldNavigationLevels(0)
    isOptionsPopoverOpen.value = false
    selectedField.value = null
    return
  }

  const field = allFieldsMap.value[highlighted.value.id]
  if (!field) {
    return
  }

  if (!fieldHasChildren(field)) {
    highlightedItemRef.value = highlighted.ref
  }

  handleFieldHighlighted(field, highlighted.ref, 0)
}

/**
 * Handles hovering in nested navigation palettes
 */
function handleNestedHighlight(levelIndex: number, highlighted: { ref: HTMLElement, value: CommandPaletteItem } | undefined) {
  const level = fieldNavigationStack.value[levelIndex]
  if (!level) {
    return
  }

  if (!highlighted) {
    closeFieldNavigationLevels(levelIndex + 1)
    return
  }

  const field = level.fields.find(f => f.key === highlighted.value.id)
  if (!field) {
    return
  }

  level.lastHighlightRef = highlighted.ref
  fieldNavigationStack.value = fieldNavigationStack.value.slice() as FieldNavigationLevel[]

  handleFieldHighlighted(field, highlighted.ref, levelIndex + 1)
}

/**
 * Processes internal field selection
 * Creates the filter or opens the options popover based on field type
 */
function handleFieldSelectInternal(field: FilterFieldConfig) {
  if (!field.key || !field.type) {
    return
  }

  if (!isFieldSelectable(field) && currentFilterId.value === null) {
    return
  }

  closeFieldNavigationLevels(0)

  if (field.type === 'select' || field.type === 'multiselect') {
    selectedField.value = field
    let existingFilter: Filter | undefined
    if (!isCreatingNewFilter.value) {
      if (currentFilterId.value) {
        existingFilter = props.filters.find(filter => filter.id === currentFilterId.value)
      }
      if (!existingFilter) {
        existingFilter = props.filters.find(filter => filter.field === field.key)
      }
    }
    tempValues.value = field.type === 'multiselect' && existingFilter ? existingFilter.values : []
    if (!highlightedItemRef.value && mainPopoverContentRef.value) {
      highlightedItemRef.value = mainPopoverContentRef.value
    }
    nextTick(() => {
      isOptionsPopoverOpen.value = true
    })
    return
  }

  const defaultOperator = field.defaultOperator || getDefaultOperatorForFieldType(field.type)
  const defaultValues = getDefaultValuesForField(field)

  emit('addFilter', field.key, defaultOperator, defaultValues, (filterId) => {
    currentFilterId.value = filterId
    isCreatingNewFilter.value = false
  })
  isOpen.value = false
}

/**
 * Handles field selection in a nested navigation palette
 */
function handleNestedFieldSelect(levelIndex: number, item: CommandPaletteItem | CommandPaletteItem[]) {
  const selectedItem = Array.isArray(item) ? item[0] : item
  if (!selectedItem || !selectedItem.id) {
    return
  }

  const level = fieldNavigationStack.value[levelIndex]
  if (!level) {
    return
  }

  const field = level.fields.find(f => f.key === selectedItem.id)
  if (!field) {
    return
  }

  const anchor = level.lastHighlightRef || level.anchor

  if (fieldHasChildren(field)) {
    openFieldNavigationLevel(levelIndex + 1, field, anchor ?? null)
    return
  }

  if (anchor) {
    highlightedItemRef.value = anchor
  }

  if (!isFieldSelectable(field) && currentFilterId.value === null) {
    return
  }

  handleFieldSelectInternal(field)
}

/**
 * Handles selection change in the options popover
 * Creates or updates the filter based on context
 */
function handleSelectChange(values: unknown[], shouldClose: boolean = true) {
  if (!selectedField.value || !selectedField.value.key || !selectedField.value.type) {
    return
  }

  const defaultOperator = selectedField.value.defaultOperator
    || (selectedField.value.type === 'multiselect' ? 'is_any_of' : 'is')

  if (!shouldClose && selectedField.value.type === 'multiselect' && currentFilterId.value) {
    emit('updateFilter', currentFilterId.value, { values })
    tempValues.value = values
    return
  }

  emit('addFilter', selectedField.value.key, defaultOperator, values, (filterId) => {
    currentFilterId.value = filterId
    isCreatingNewFilter.value = false
  })

  if (shouldClose) {
    isOpen.value = false
    isOptionsPopoverOpen.value = false
    selectedField.value = null
    tempValues.value = []
    currentFilterId.value = null
    isCreatingNewFilter.value = true
  } else {
    tempValues.value = values
  }
}

/**
 * Closes all popovers and resets state
 */
function handleClose() {
  isOpen.value = false
  isOptionsPopoverOpen.value = false
  selectedField.value = null
  tempValues.value = []
  highlightedItemRef.value = null
  currentFilterId.value = null
  isCreatingNewFilter.value = true
  closeFieldNavigationLevels(0)
}

/**
 * Handles nested options popover close
 */
function handleNestedPopoverClose(open: boolean) {
  if (!open) {
    isOptionsPopoverOpen.value = false
    selectedField.value = null
  }
}

/**
 * Handles main popover close
 */
function handleMainPopoverClose(open: boolean) {
  if (!open) {
    isOptionsPopoverOpen.value = false
    selectedField.value = null
    highlightedItemRef.value = null
    tempValues.value = []
    currentFilterId.value = null
    isCreatingNewFilter.value = true
    closeFieldNavigationLevels(0)
  } else {
    tempValues.value = []
    currentFilterId.value = null
    isCreatingNewFilter.value = true
  }
}

/**
 * Determines default values for a field based on its type
 * Handles special cases for ranges and specific types
 */
function getDefaultValuesForField(field: FilterFieldConfig): unknown[] {
  if (['text', 'email', 'url', 'tel'].includes(field.type || '')) {
    return ['']
  }
  if (field.type === 'number') {
    // If default operator is 'between' or 'not_between', return a range
    const defaultOp = field.defaultOperator || getDefaultOperatorForFieldType(field.type)
    if (defaultOp === 'between' || defaultOp === 'not_between') {
      return [field.min || 0, field.max || 100]
    }
    return ['']
  }
  if (field.type === 'date') {
    // If default operator is 'between' or 'not_between', return a range
    const defaultOp = field.defaultOperator || getDefaultOperatorForFieldType(field.type)
    if (defaultOp === 'between' || defaultOp === 'not_between') {
      return ['', '']
    }
    return ['']
  }
  if (field.type === 'datetime') {
    // If default operator is 'between' or 'not_between', return a range
    const defaultOp = field.defaultOperator || getDefaultOperatorForFieldType(field.type)
    if (defaultOp === 'between' || defaultOp === 'not_between') {
      return ['', '']
    }
    return ['']
  }
  if (field.type === 'time') {
    // If default operator is 'between' or 'not_between', return a range
    const defaultOp = field.defaultOperator || getDefaultOperatorForFieldType(field.type)
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
