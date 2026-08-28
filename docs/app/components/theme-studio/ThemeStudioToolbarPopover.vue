<script setup lang="ts">
import { keepPanels } from '../../utils/theme/studio'
/**
 * A labelled toolbar button opening its panel. The trigger reports the value
 * it holds, and turns primary when that value has drifted from the preset.
 */
const props = defineProps<{
  label: string
  icon?: string
  /** The trigger's text, reported before the panel is opened. */
  value?: string
  dirty?: boolean
  /** Stack the control and show its label, for the header's mobile menu. */
  vertical?: boolean
}>()

const open = defineModel<boolean>('open', { default: false })

const appConfig = useAppConfig()

// The trigger's visible text is the value, so the name names the control AND
// keeps that text (voice control matches on what's on screen).
const ariaLabel = computed(() => props.value ? `${props.label}: ${props.value}` : props.label)

// In the bar the panel has a width of its own; stacked in the mobile menu it
// takes the trigger's, like a select. Reka publishes the anchor width.
const content = computed(() => [
  props.vertical ? 'w-(--reka-popper-anchor-width)' : 'w-80 max-w-[calc(100vw-2rem)]',
  'max-h-[70vh] overflow-y-auto'
])
</script>

<template>
  <ThemeStudioToolbarField :label="label" :vertical="vertical">
    <UPopover v-model:open="open" :content="{ align: 'center', onInteractOutside: keepPanels }" :ui="{ content }">
      <UButton
        :label="value"
        :icon="icon"
        :trailing-icon="appConfig.ui.icons.chevronDown"
        :color="dirty ? 'primary' : 'neutral'"
        variant="outline"
        :class="['group', vertical ? 'w-full' : 'w-38']"
        :ui="{
          label: 'flex-1 min-w-0 text-left truncate',
          leadingIcon: dirty ? 'text-primary' : 'text-dimmed',
          trailingIcon: ['transition-transform duration-200', open && 'rotate-180', dirty ? 'text-primary' : 'text-dimmed']
        }"
        :aria-label="ariaLabel"
      >
        <template v-if="!!$slots.leading" #leading>
          <slot name="leading" />
        </template>
      </UButton>

      <template #content>
        <slot />
      </template>
    </UPopover>
  </ThemeStudioToolbarField>
</template>
