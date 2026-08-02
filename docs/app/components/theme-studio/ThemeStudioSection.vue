<script setup lang="ts">
/**
 * One settings section, folded behind a full-width trigger button (the
 * Semantic/Modifiers treatment). The help link and action toggles sit
 * beside the trigger as their own buttons — they stop the click so they
 * never toggle the fold; actions force it open instead, so what they
 * reveal is visible.
 */
import type { SectionKey } from '../../utils/theme-engine'

const props = withDefaults(defineProps<{
  label: string
  /** Docs page the header's help icon links to */
  helpTo?: string
  defaultOpen?: boolean
  /**
   * Names the ThemeDoc section(s) this fold owns — the header then carries a
   * reset button enabled while any of them diverges from the baseline
   * preset, wired straight to the studio's sectionDirty/resetSection.
   */
  sectionKey?: SectionKey | SectionKey[]
  /**
   * Off renders the header and content without the fold. Only the panel's
   * top-level sections collapse; a fold inside a fold hides content behind
   * two clicks and reads as a menu that keeps going.
   */
  collapsible?: boolean
}>(), {
  defaultOpen: true,
  collapsible: true
})

const { sectionDirty, resetSection } = useThemeStudio()
const dirty = computed(() => (props.sectionKey ? sectionDirty(props.sectionKey).value : false))

const slots = defineSlots<{
  default: () => any
  /** Controls beside the trigger (edit/adjust toggles). */
  actions: () => any
}>()

// Static sections are always open — the fold is what `collapsible` removes.
const open = ref(props.collapsible ? props.defaultOpen : true)
</script>

<template>
  <!-- Static sections keep the same shell, disabled and pinned open, so the
       header/content markup below has one shape. -->
  <UCollapsible v-model:open="open" :disabled="!collapsible">
    <div class="flex items-center gap-1">
      <!-- One button either way, so padding, size and type come from one
           place. Leading chevron: the disclosure cue that tells a fold
           trigger apart from a select (whose chevron trails). A static
           section renders as a span with no chevron and no hover — nothing
           to disclose, nothing to click. -->
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
        :ui="collapsible ? undefined : { base: 'hover:bg-transparent cursor-default select-none' }"
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

      <UTooltip v-if="sectionKey" :text="dirty ? 'Reset to preset' : 'Matches the preset'">
        <UButton
          size="sm"
          :color="dirty ? 'primary' : 'neutral'"
          variant="ghost"
          icon="i-lucide-rotate-ccw"
          :disabled="!dirty"
          :aria-label="`Reset ${label} to preset`"
          @click.stop="resetSection(sectionKey!)"
        />
      </UTooltip>

      <div v-if="!!slots.actions" class="flex items-center gap-1" @click.stop="open = true">
        <slot name="actions" />
      </div>
    </div>

    <template #content>
      <div class="pt-2">
        <slot />
      </div>
    </template>
  </UCollapsible>
</template>
