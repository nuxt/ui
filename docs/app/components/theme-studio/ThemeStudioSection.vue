<script setup lang="ts">
/**
 * One settings section. Help and action buttons stop the click so they never
 * toggle the fold; actions force it open, so what they reveal is visible.
 */
import type { SectionKey } from '../../utils/theme-engine'
import { SECTION_DEPTH } from '../../utils/theme-section'

const props = withDefaults(defineProps<{
  /** Omit on a static section for a bare group — no header drawn. */
  label?: string
  /** Docs page the header's help icon links to */
  helpTo?: string
  /** The ThemeDoc slice(s) this fold owns; drives its reset button. */
  sectionKey?: SectionKey | SectionKey[]
  /** Reset a section the doc has no slice for — the caller says when it's dirty. */
  resettable?: boolean
  resetDirty?: boolean
  /* These three default from depth — pass one only to override it. */
  defaultOpen?: boolean
  collapsible?: boolean
  separator?: boolean
}>(), {
  // absent optional booleans cast to false, which would read as an override
  defaultOpen: undefined,
  collapsible: undefined,
  separator: undefined,
  resettable: undefined,
  resetDirty: undefined
})

const emit = defineEmits<{ reset: [] }>()

const { sectionDirty, resetSection } = useThemeStudio()

// A section resets either its doc slice or whatever the caller wired up.
const showReset = computed(() => !!props.sectionKey || !!props.resettable)
const dirty = computed(() => (props.sectionKey ? sectionDirty(props.sectionKey).value : !!props.resetDirty))

function reset() {
  if (props.sectionKey) resetSection(props.sectionKey)
  else emit('reset')
}

const slots = defineSlots<{
  default: () => any
  /** Controls beside the trigger (edit/adjust toggles). */
  actions: () => any
}>()

/**
 * Depth decides how a section behaves, so no caller has to: the top level
 * folds open, the layer under it folds shut, and the leaves are plain groups.
 */
const depth = inject(SECTION_DEPTH, 0)
provide(SECTION_DEPTH, depth + 1)

const collapsible = computed(() => props.collapsible ?? depth < 2)
const separator = computed(() => props.separator ?? depth < 2)

// Static sections are always open.
const open = ref(collapsible.value ? (props.defaultOpen ?? depth === 0) : true)

// A first child sits right under the header — nothing above it to separate from.
const contentClass = 'pt-2 flex flex-col gap-2 [&>*:first-child]:border-t-0 [&>*:first-child]:mt-0 [&>*:first-child]:pt-0'
</script>

<template>
  <!-- Owns its own padding, gap and rule, so no caller sets spacing. -->
  <UCollapsible
    v-model:open="open"
    :disabled="!collapsible"
    :class="[
      /* Only the first layer insets from the panel edge; nested sections line
         up with the content they sit in. Space above a rule comes from the
         parent's gap, below it from this padding — setting both would double. */
      depth === 0 ? 'p-4' : (separator ? 'pt-2' : ''),
      separator && 'border-t border-default'
    ]"
    :ui="{ content: contentClass }"
  >
    <!-- Nothing to put in the header means it's just a group. -->
    <div v-if="collapsible || label || helpTo || showReset || !!slots.actions" class="flex items-center gap-1">
      <!-- One button either way, so padding and type come from one place.
           The leading chevron tells a fold apart from a select. -->
      <UButton
        :label="label"
        :icon="collapsible ? (open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right') : undefined"
        :as="collapsible ? undefined : 'span'"
        color="neutral"
        variant="ghost"
        size="sm"
        block
        class="justify-start flex-1"
        :class="{ 'px-0': !collapsible }"
        :tabindex="collapsible ? undefined : -1"
        :ui="collapsible ? undefined : {
          /* a heading shouldn't tint on hover, press or open, and its button
             padding would double the section's own */
          base: 'cursor-default select-none hover:bg-transparent active:bg-transparent data-[state=open]:bg-transparent focus:outline-none focus-visible:outline-none focus-visible:ring-0'
        }"
      />

      <UTooltip text="Docs">
        <UButton
          v-if="helpTo"
          :to="helpTo"
          size="sm"
          color="neutral"
          variant="ghost"
          icon="i-lucide-help-circle"
          aria-label="Documentation for this setting"
          @click.stop
        />
      </UTooltip>

      <UTooltip v-if="showReset" :text="dirty ? 'Reset to preset' : 'Matches the preset'">
        <UButton
          size="sm"
          :color="dirty ? 'primary' : 'neutral'"
          variant="ghost"
          icon="i-lucide-rotate-ccw"
          :disabled="!dirty"
          :aria-label="`Reset ${label} to preset`"
          @click.stop="reset"
        />
      </UTooltip>

      <div v-if="!!slots.actions" class="flex items-center gap-1" @click.stop="open = true">
        <slot name="actions" />
      </div>
    </div>

    <template #content>
      <slot />
    </template>
  </UCollapsible>
</template>
