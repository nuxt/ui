<script setup lang="ts">
import { keepPanels } from '../../utils/theme/studio'

/**
 * The toolbar's select-shaped controls (icons, radius). Everything that makes
 * a select read like the popover triggers beside it lives here once, so the
 * two can't drift apart again: a select renders its value `text-highlighted`
 * at weight 400 where a button renders its label `text-default` at 500, and
 * the dirty state has to reach the ring, the value and both icons.
 */
defineProps<{
  /** Radius stops are numbers, icon sets are strings. */
  items: { label: string, value: string | number, icon?: string }[]
  /** The trigger's leading glyph. */
  icon?: string
  dirty?: boolean
  /** For a list that needs more room than the trigger, e.g. icon previews. */
  contentClass?: string
}>()

const model = defineModel<string | number>()

/** Exposed so the toolbar can pin itself while the list is open. */
const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <USelectMenu
    v-model="model"
    v-model:open="open"
    :items="items"
    value-key="value"
    :icon="icon"
    :content="{ onInteractOutside: keepPanels }"
    :search-input="false"
    :color="dirty ? 'primary' : 'neutral'"
    :highlight="dirty"
    variant="outline"
    :ui="{
      base: dirty && 'ring-primary/50',
      value: ['font-medium', dirty ? 'text-primary' : 'text-default'],
      leadingIcon: dirty ? 'text-primary' : 'text-dimmed',
      trailingIcon: ['transition-transform duration-200', open && 'rotate-180', dirty ? 'text-primary' : 'text-dimmed'],
      content: contentClass
    }"
  >
    <template v-if="!!$slots['item-description']" #item-description="scope">
      <slot name="item-description" v-bind="scope" />
    </template>
  </USelectMenu>
</template>
