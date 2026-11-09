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
  /** Hovering a row previews it on the page, picking it applies it. */
  preview?: boolean
  modelValue?: string | number
}>()

defineOptions({ inheritAttrs: false })

/** Local unless a caller binds it; drives the chevron rotation. */
const open = defineModel<boolean>('open', { default: false })

const attrs = useAttrs()

/** The selected row picked again, which Reka reports as a toggle off. */
const emit = defineEmits<{
  'reselect': [value: string | number]
  'update:modelValue': [value: string | number]
}>()

// A plain prop and emit, not defineModel: a preview writes the value and
// the pick's restore puts the old one back outside the model, so the model's
// local copy still holds the previewed value and would swallow the pick.
const update = (value: string | number) => emit('update:modelValue', value)

const { show, cancel, commit, onPointermove, onKeydown } = useThemePreview({ intent: true })

// the applied value, held while a preview runs so the label and check stay on it
const applied = useHeldDuringPreview(() => props.modelValue)

const triggerLabel = computed(() => props.items.find(item => item.value === applied.value)?.label ?? props.placeholder)

// Reka toggles the selected row off with `undefined`; a pick-one control
// keeps its value and just closes, but still reports the re-pick, which the
// preset control turns into a re-apply.
const selected = computed({
  get: () => applied.value,
  set: (value: string | number | undefined) => {
    const current = applied.value
    commit(() => {
      if (value !== undefined) update(value)
      else if (current !== undefined) emit('reselect', current)
    })
    open.value = false
  }
})

// The applied row previews nothing: a preset previewed over its own edits
// would drop them.
function onHighlight(payload?: { value: unknown }) {
  if (!props.preview) return
  const value = payload?.value as string | number | undefined
  show(value === undefined || value === applied.value ? undefined : () => update(value))
}

watch(open, (isOpen) => {
  if (!isOpen) cancel()
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
      <!-- the popover already frames the panel, the listbox only fills it;
           the wrapper tells a hover from the listbox's own highlight on open -->
      <div class="contents" @pointermove="onPointermove" @keydown="onKeydown">
        <UListbox
          v-model="selected"
          :items="items"
          value-key="value"
          highlight-on-hover
          :aria-label="(attrs['aria-label'] as string | undefined)"
          :ui="{ root: 'ring-0 has-focus-visible:outline-0', content: 'max-h-106' }"
          @highlight="onHighlight"
          @leave="onHighlight()"
        >
          <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
            <slot :name="name" v-bind="scope ?? {}" />
          </template>
        </UListbox>
      </div>
    </template>
  </UPopover>
</template>
