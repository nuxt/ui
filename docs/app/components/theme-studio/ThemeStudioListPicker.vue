<script setup lang="ts">
import { keepPanels } from '../../utils/theme/studio'
/**
 * A popover + listbox picker: subtle trigger button, rich rows (slots can
 * restyle labels or add description strips), closes on pick. The listbox
 * root drops its own ring, it would double the popover's chrome.
 */
export interface ListPickerItem {
  label: string
  value: string
  [key: string]: unknown
}

const props = withDefaults(defineProps<{
  items: ListPickerItem[]
  icon?: string
  ariaLabel?: string
  /** Stands in for the listbox when nothing matches. */
  empty?: string
  /** Panels use the default; the toolbar matches the controls beside it. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** For hosts that hide their own label (the toolbar outside fullscreen). */
  tooltip?: string
  /** Panels sit on subtle; the toolbar matches the outlined controls beside it. */
  variant?: 'subtle' | 'outline'
}>(), {
  variant: 'subtle'
})

const model = defineModel<string>({ required: true })
const open = defineModel<boolean>('open', { default: false })

const selected = computed(() => props.items.find(item => item.value === model.value))
</script>

<template>
  <UPopover v-model:open="open" :content="{ align: 'start', onInteractOutside: keepPanels }">
    <UTooltip :text="tooltip" :disabled="!tooltip">
      <UButton
        color="neutral"
        :variant="variant"
        :size="size"
        block
        :icon="icon"
        trailing-icon="i-lucide-chevron-down"
        :aria-label="ariaLabel"
      >
        <!-- The classes live on this span, not `ui.label`: UButton only applies
             that to the span it renders for the `label` PROP, so a default-slot
             trigger never sees it and a long name wraps instead of clipping. -->
        <span class="flex-1 min-w-0 text-left truncate">
          <slot name="trigger" :selected="selected">{{ selected?.label }}</slot>
        </span>
      </UButton>
    </UTooltip>

    <template #content>
      <div class="w-72 flex flex-col">
        <slot name="header" />

        <UListbox
          v-if="items.length"
          v-model="model"
          :items="items"
          value-key="value"
          :ui="{ root: 'ring-0 rounded-md', content: 'max-h-80' }"
          @update:model-value="open = false"
        >
          <template v-if="$slots['item-label']" #item-label="scope">
            <slot name="item-label" v-bind="scope" />
          </template>

          <template v-if="$slots['item-description']" #item-description="scope">
            <slot name="item-description" v-bind="scope" />
          </template>
        </UListbox>

        <p v-else-if="empty" class="px-3 py-6 text-xs text-muted text-center select-none">
          {{ empty }}
        </p>
      </div>
    </template>
  </UPopover>
</template>
