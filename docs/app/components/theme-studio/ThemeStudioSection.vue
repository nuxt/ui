<script setup lang="ts">
/**
 * One settings section: a heading row over its rows, with a reset for the doc
 * slice it owns. Panels are read top to bottom, so nothing here folds; the
 * two editors that do fold hang off their own toggle in the header.
 */
import type { SectionKey } from '../../utils/theme/engine'
import { SECTION_DEPTH } from '../../utils/theme/studio'

const props = withDefaults(defineProps<{
  /** Omit on a static section for a bare group, no header drawn. */
  label?: string
  /** Docs page the header's help icon links to */
  helpTo?: string
  /** The ThemeDoc slice(s) this section owns; drives its reset button. */
  sectionKey?: SectionKey | SectionKey[]
  /** Reset a section the doc has no slice for, the caller says when it's dirty. */
  resettable?: boolean
  resetDirty?: boolean
  /** Defaults from depth, pass it only to override. */
  separator?: boolean
}>(), {
  // absent optional booleans cast to false, which would read as an override
  separator: undefined,
  resettable: undefined,
  resetDirty: undefined
})

const emit = defineEmits<{ reset: [] }>()

const { sectionDirty, resetSection } = useThemeStudio()
const studioIcons = useStudioIcons()

// A section resets either its doc slice or whatever the caller wired up.
const showReset = computed(() => !!props.sectionKey || !!props.resettable)
// sectionDirty is a computed factory, so it is called once (with a getter,
// so it follows the prop) rather than inside a getter of our own, which
// would allocate a fresh computed on every re-run
const sliceDirty = sectionDirty(() => props.sectionKey)
const dirty = computed(() => (props.sectionKey ? sliceDirty.value : !!props.resetDirty))

function reset() {
  if (props.sectionKey) resetSection(props.sectionKey)
  else emit('reset')
}

const slots = defineSlots<{
  default: () => any
  /** Controls beside the heading (the edit/adjust toggles). */
  actions: () => any
}>()

// Top-level sections carry the panel's padding, nested ones only their rule.
const depth = inject(SECTION_DEPTH, 0)
provide(SECTION_DEPTH, depth + 1)

const hasHeader = computed(() => !!(props.label || props.helpTo || showReset.value || slots.actions))
const separator = computed(() => props.separator ?? depth < 2)
</script>

<template>
  <div
    data-studio-section
    :class="[
      /* Space above a rule is the parent's gap, below it this padding. */
      depth === 0 ? 'p-4' : (separator ? 'pt-2' : ''),
      separator && 'border-t border-default'
    ]"
  >
    <div v-if="hasHeader" class="flex items-center gap-1">
      <!-- a heading, never a trigger; text-sm/7 gives it the 28px row
           height the buttons beside it have -->
      <span class="flex-1 min-w-0 text-sm/7 font-medium text-highlighted truncate">{{ label }}</span>

      <UTooltip v-if="helpTo" text="Docs">
        <UButton
          :to="helpTo"
          size="sm"
          color="neutral"
          variant="ghost"
          icon="i-lucide-help-circle"
          aria-label="Documentation for this setting"
        />
      </UTooltip>

      <UTooltip v-if="showReset" :text="dirty ? 'Reset to preset' : 'Matches the preset'">
        <UButton
          size="sm"
          color="neutral"
          variant="ghost"
          :active="dirty"
          active-color="primary"
          :icon="studioIcons.reset"
          :disabled="!dirty"
          :aria-label="label ? `Reset ${label} to preset` : 'Reset to preset'"
          @click="reset"
        />
      </UTooltip>

      <div v-if="!!slots.actions" class="flex items-center gap-1">
        <slot name="actions" />
      </div>
    </div>

    <!-- A first nested section sits right under the header, nothing above it
         to separate from. Scoped to sections: any other first child keeps
         its padding. -->
    <div class="pt-2 flex flex-col gap-2 [&>[data-studio-section]:first-child]:border-t-0 [&>[data-studio-section]:first-child]:mt-0 [&>[data-studio-section]:first-child]:pt-0">
      <slot />
    </div>
  </div>
</template>
