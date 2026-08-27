<script setup lang="ts">
import { keepPanels } from '../../utils/theme/studio'
/**
 * A labelled toolbar button opening its panel. The trigger reports the value
 * it holds, and turns primary when that value has drifted from the preset.
 */
const props = defineProps<{
  label: string
  icon?: string
  /** The trigger's text; omit for an icon-only button. */
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
</script>

<template>
  <ThemeStudioToolbarField :label="label" :vertical="vertical">
    <UPopover v-model:open="open" :content="{ align: 'start', onInteractOutside: keepPanels }">
      <!-- Reka binds a tooltip to its ONE child element, a popover root
           renders nothing, so the tooltip has to sit on the button. -->
      <UTooltip :text="label" :disabled="vertical">
        <UButton
          :label="value"
          :icon="icon"
          :trailing-icon="appConfig.ui.icons.chevronDown"
          :color="dirty ? 'primary' : 'neutral'"
          variant="outline"
          :class="['group', vertical ? 'w-full justify-between' : value && 'w-38']"
          :ui="{
            label: 'flex-1 min-w-0 text-left truncate',
            trailingIcon: ['transition-transform duration-200', open && 'rotate-180']
          }"
          :aria-label="ariaLabel"
        >
          <template v-if="!!$slots.leading" #leading>
            <slot name="leading" />
          </template>
        </UButton>
      </UTooltip>

      <template #content>
        <slot />
      </template>
    </UPopover>
  </ThemeStudioToolbarField>
</template>
