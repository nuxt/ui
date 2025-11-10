<!--
  Option selection component in a popover
  Uses UCommandPalette to enable search and multiple selection
  Organizes options into groups (selected / available)
-->
<template>
  <UCommandPalette
    v-model="selectedValues"
    :groups="commandGroups"
    :placeholder="context.i18n.placeholders.searchField(field.label || '')"
    :ui="{
      input: '[&>input]:h-8 [&>input]:text-sm'
    }"
    :multiple="isMultiSelect"
    @update:model-value="handleChange"
  >
    <template #empty>
      <div class="py-4 text-center text-sm text-gray-500">
        {{ context.i18n.noResultsFound }}
      </div>
    </template>
  </UCommandPalette>
</template>

<script setup lang="ts">
import type { CommandPaletteItem } from '../../types'
import type { FilterFieldConfig } from '../../types/filter'
import { useFilterContext } from '../../composables/useFilterContext'
import { ref, computed, watch } from 'vue'
import UCommandPalette from '../CommandPalette.vue'

interface Props {
  field: FilterFieldConfig
  values: unknown[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  change: [values: unknown[], shouldClose?: boolean]
  close: []
}>()

const context = useFilterContext()
const selectedValues = ref<CommandPaletteItem[]>([])

// Determines if multiselect mode is enabled
const isMultiSelect = computed(() => props.field.type === 'multiselect' || props.values.length > 1)

// Initializes selectedValues from props.values to synchronize state
watch(
  () => props.values,
  (newValues) => {
    if (props.field.options) {
      selectedValues.value = props.field.options
        .filter(opt => newValues.includes(opt.value))
        .map(opt => ({
          id: String(opt.value),
          label: opt.label,
          icon: typeof opt.icon === 'string' ? opt.icon : undefined
        })) as CommandPaletteItem[]
    }
  },
  { immediate: true }
)

// Organizes options into groups: selected first, then available
const commandGroups = computed(() => {
  if (!props.field.options) {
    return []
  }

  const selectedOptions = props.field.options.filter(opt => props.values.includes(opt.value))
  const unselectedOptions = props.field.options.filter(opt => !props.values.includes(opt.value))

  const groups: Array<{ id: string, items: CommandPaletteItem[] }> = []

  if (selectedOptions.length > 0) {
    groups.push({
      id: 'selected',
      items: selectedOptions.map(opt => ({
        id: String(opt.value),
        label: opt.label,
        icon: typeof opt.icon === 'string' ? opt.icon : undefined
      }))
    })
  }

  if (unselectedOptions.length > 0) {
    groups.push({
      id: 'available',
      items: unselectedOptions.map(opt => ({
        id: String(opt.value),
        label: opt.label,
        icon: typeof opt.icon === 'string' ? opt.icon : undefined
      }))
    })
  }

  return groups
})

/**
 * Handles selection change in the palette
 * Automatically closes popover for simple selections, stays open for multiselect
 */
function handleChange(items: CommandPaletteItem | CommandPaletteItem[]) {
  const selectedItems = Array.isArray(items) ? items : [items]
  const newValues = selectedItems
    .map((item) => {
      const option = props.field.options?.find(opt => String(opt.value) === item.id)
      return option?.value
    })
    .filter((v): v is unknown => v !== undefined)

  if (isMultiSelect.value) {
    emit('change', newValues, false)
  } else {
    emit('change', newValues, true)
  }
}
</script>
