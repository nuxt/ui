<script setup lang="ts">
import type { ChipProps } from '@nuxt/ui'

/**
 * A USelect whose stock choice is deduped into a single tagged entry, the
 * item carrying `defaultTag` renders a muted "(Default)" suffix in the LIST,
 * where it tells you which option is the stock one. The trigger shows the
 * plain label: there it only lengthens the value you already picked.
 */
export interface DefaultSelectItem {
  label: string
  value: string
  defaultTag?: boolean
  chip?: ChipProps
}

const props = defineProps<{
  items: DefaultSelectItem[]
  icon?: string
  ariaLabel?: string
}>()

const model = defineModel<string>({ required: true })

const selected = computed(() => props.items.find(item => item.value === model.value))

/** The slot scope types items as the broad SelectItem union, narrow it. */
function asItem(item: unknown) {
  return item as DefaultSelectItem
}
</script>

<template>
  <USelect
    v-model="model"
    size="sm"
    color="neutral"
    variant="subtle"
    :icon="icon"
    :items="items"
    :aria-label="ariaLabel"
  >
    <template v-if="$slots.leading" #leading>
      <slot name="leading" />
    </template>

    <template #default>
      {{ selected?.label }}
    </template>

    <template #item-label="{ item }">
      {{ asItem(item).label }}<span v-if="asItem(item).defaultTag" class="text-dimmed">&nbsp;(Default)</span>
    </template>
  </USelect>
</template>
