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
   * Names the ThemeDoc section this fold owns — the header then carries a
   * reset button enabled while the section diverges from the baseline
   * preset, wired straight to the studio's sectionDirty/resetSection.
   */
  sectionKey?: SectionKey
}>(), {
  defaultOpen: true
})

const { sectionDirty, resetSection } = useThemeStudio()
const features = useStudioFeatures()
const dirty = computed(() => (props.sectionKey ? sectionDirty(props.sectionKey).value : false))

const slots = defineSlots<{
  default: () => any
  /** Controls beside the trigger (edit/adjust toggles). */
  actions: () => any
}>()

const open = ref(props.defaultOpen)
</script>

<template>
  <UCollapsible v-model:open="open">
    <div class="flex items-center gap-1">
      <!-- Leading chevron: the disclosure cue that tells a fold trigger
           apart from a select (whose chevron trails). -->
      <UButton
        :label="label"
        :icon="open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
        color="neutral"
        variant="ghost"
        size="sm"
        block
        class="justify-start flex-1"
      />

      <UTooltip text="Docs">
        <UButton
          v-if="helpTo && features.help"
          :to="helpTo"
          size="sm"
          color="neutral"
          variant="ghost"
          icon="i-lucide-help-circle"
          aria-label="Documentation for this setting"
          @click.stop
        />
      </UTooltip>

      <UTooltip v-if="sectionKey && features.reset" :text="dirty ? 'Reset to preset' : 'Matches the preset'">
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
