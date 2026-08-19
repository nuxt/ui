<script setup lang="ts">
import { keepPanels } from '../../utils/theme/studio'

/**
 * The radius picker. Seven discrete stops as a segmented row was wider than
 * every other toolbar control put together, so it reads them out of a select
 * like the font and icon pickers beside it.
 */
defineProps<{ tooltip?: string, dirty?: boolean }>()

/** Exposed so the toolbar can pin itself while the list is open. */
const open = defineModel<boolean>('open', { default: false })

// The tooltip has to wrap the trigger, so it takes the root; forward the
// caller's class past it or the toolbar's width lands on nothing.
defineOptions({ inheritAttrs: false })

const { radius, radiuses } = useTheme()
const studioIcons = useStudioIcons()

// `--ui-radius` is a rem length, so the stop IS the label.
const items = radiuses.map(value => ({ label: `${value}rem`, value }))
</script>

<template>
  <UTooltip :text="tooltip" :disabled="!tooltip">
    <USelectMenu
      v-model="radius"
      v-model:open="open"
      :items="items"
      value-key="value"
      :icon="studioIcons.radius"
      :content="{ onInteractOutside: keepPanels }"
      :search-input="false"
      :color="dirty ? 'primary' : 'neutral'"
      :highlight="dirty"
      variant="outline"
      :ui="{
        base: dirty && 'ring-primary/50 text-primary',
        leadingIcon: dirty && 'text-primary',
        trailingIcon: dirty && 'text-primary'
      }"
      aria-label="Radius"
      v-bind="$attrs"
    />
  </UTooltip>
</template>
