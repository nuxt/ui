<script setup lang="ts">
import { keepPanels, toolbarPanelClass } from '../../../utils/theme/studio'

/**
 * The toolbar's pick-one controls (preset, icons, radius): the shared trigger
 * opening a plain listbox, the same shape as the popover panels beside them.
 * A select menu is a whole combobox with its own trigger styling; these
 * lists are a dozen rows at most.
 */
const props = defineProps<{
  /** Radius stops are numbers, icon sets are strings. */
  items: { label: string, value: string | number, icon?: string }[]
  /** The trigger's leading glyph. */
  icon?: string
  /** Overrides the dimmed leading glyph while clean (the preset chip stays primary). */
  leadingIconClass?: string
  dirty?: boolean
  /** Trigger text while no item matches the value (preset-less, or pre-mount). */
  placeholder?: string
  /** Stacked in the mobile menu: the list takes the trigger's width. */
  vertical?: boolean
}>()

defineOptions({ inheritAttrs: false })

const model = defineModel<string | number>()

/** Local unless a caller binds it; drives the chevron rotation. */
const open = defineModel<boolean>('open', { default: false })

const attrs = useAttrs()

const triggerLabel = computed(() => props.items.find(item => item.value === model.value)?.label ?? props.placeholder)

// Reka toggles the selected row off with `undefined`; a pick-one control
// keeps its value and just closes.
const selected = computed({
  get: () => model.value,
  set: (value: string | number | undefined) => {
    if (value !== undefined) model.value = value
    open.value = false
  }
})
</script>

<template>
  <UPopover v-model:open="open" :content="{ align: 'center', onInteractOutside: keepPanels }" :ui="{ content: toolbarPanelClass(vertical) }">
    <ThemeStudioToolbarTrigger
      :label="triggerLabel"
      :icon="icon"
      :leading-icon-class="leadingIconClass"
      :dirty="dirty"
      :open="open"
      v-bind="attrs"
    />

    <template #content>
      <!-- the popover already frames the panel, the listbox only fills it -->
      <UListbox
        v-model="selected"
        :items="items"
        value-key="value"
        highlight-on-hover
        :aria-label="(attrs['aria-label'] as string | undefined)"
        :ui="{ root: 'ring-0 has-focus-visible:outline-0', content: 'max-h-106' }"
      >
        <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
          <slot :name="name" v-bind="scope ?? {}" />
        </template>
      </UListbox>
    </template>
  </UPopover>
</template>
