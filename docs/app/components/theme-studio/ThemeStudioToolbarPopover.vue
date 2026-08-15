<script setup lang="ts">
import { keepPanels } from '../../utils/theme/studio'
/**
 * A labelled toolbar button opening its panel. The trigger reports the value
 * it holds, and a chip when that value has drifted from the preset.
 */
defineProps<{
  label: string
  icon?: string
  /** The trigger's text; omit for an icon-only button. */
  value?: string
  dirty?: boolean
}>()

const open = defineModel<boolean>('open', { default: false })

const appConfig = useAppConfig()
const { fullscreen } = useThemeStudioView()
</script>

<template>
  <ThemeStudioToolbarField :label="label">
    <UPopover v-model:open="open" :content="{ align: 'start', onInteractOutside: keepPanels }">
      <!-- Reka binds a tooltip to its ONE child element, a popover root
           renders nothing, so the tooltip has to sit on the button. -->
      <UTooltip :text="label" :disabled="fullscreen">
        <UChip :show="!!dirty" color="primary" size="sm">
          <UButton
            :label="value"
            :icon="icon"
            :trailing-icon="appConfig.ui.icons.chevronDown"
            color="neutral"
            variant="outline"
            :class="value && 'w-38'"
            :ui="{ label: 'flex-1 min-w-0 text-left truncate' }"
            :aria-label="label"
          >
            <template v-if="!!$slots.leading" #leading>
              <slot name="leading" />
            </template>
          </UButton>
        </UChip>
      </UTooltip>

      <template #content>
        <slot />
      </template>
    </UPopover>
  </ThemeStudioToolbarField>
</template>
