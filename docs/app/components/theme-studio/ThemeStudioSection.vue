<script setup lang="ts">
/**
 * One settings section: a heading row over its rows, with a reset for the doc
 * slice it owns. Panels are read top to bottom, so nothing here folds;
 * whatever does fold hangs off its own toggle in the header (#actions).
 */
import type { SectionKey } from '../../utils/theme/engine'

const props = defineProps<{
  /** Omit on a static section for a bare group, no header drawn. */
  label?: string
  /** Docs page the header's help icon links to */
  helpTo?: string
  /** The ThemeDoc slice(s) this section owns; drives its reset button. */
  sectionKey?: SectionKey | SectionKey[]
  /** Reset a section the doc has no slice for, the caller says when it's dirty. */
  resettable?: boolean
  resetDirty?: boolean
  /** Whether the section has a collapsible content. */
  collapsible?: boolean
}>()

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

const hasHeader = computed(() => !!(props.label || props.helpTo || showReset.value || slots.actions))
</script>

<template>
  <div :class="[{ 'flex flex-col gap-1': !collapsible }]">
    <div v-if="hasHeader" class="flex items-center gap-0.5" :class="[collapsible ? '-my-1' : '-mt-1']">
      <span class="flex-1 min-w-0 text-xs/5 font-semibold truncate" :class="[collapsible ? 'text-muted' : 'text-highlighted']">{{ label }}</span>

      <UTooltip v-if="helpTo" text="Docs" ignore-non-keyboard-focus>
        <UButton
          :to="helpTo"
          size="sm"
          color="neutral"
          variant="ghost"
          icon="i-lucide-help-circle"
          aria-label="Documentation for this setting"
        />
      </UTooltip>

      <UTooltip v-if="showReset" :text="dirty ? 'Reset to preset' : 'Matches the preset'" ignore-non-keyboard-focus>
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

      <slot name="actions" />
    </div>

    <slot />
  </div>
</template>
