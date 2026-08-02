<script setup lang="ts">
import type { ColorAlias, SectionKey } from '../../utils/theme-engine'

/**
 * One color alias in the Colors panel: a section header carrying the edit
 * and adjust-shades toggles, the picker below, and the palette editor /
 * shade sliders folding out underneath. Color aliases expose their accent
 * pair; neutral carries every neutral-ramped token group.
 */
const props = withDefaults(defineProps<{
  alias: ColorAlias
  /** Header text — defaults to the capitalized alias. */
  label?: string
  helpTo?: string
  /** Passed through to the section header's reset affordance. */
  sectionKey?: SectionKey
  /** Off for the aliases nested under Semantic — only top level folds. */
  collapsible?: boolean
}>(), {
  collapsible: true
})

const { rampChip } = useThemeStudio()
const { shadeLadder, sections } = useTokenShades(props.alias)

const title = computed(() => props.label ?? capitalize(props.alias))

const paletteEditor = ref(false)
const shadeEditor = ref(false)
</script>

<template>
  <ThemeStudioSection :label="title" :help-to="helpTo" :section-key="sectionKey" :collapsible="collapsible">
    <template #actions>
      <UTooltip text="Adjust shades">
        <UButton
          icon="i-lucide-settings-2"
          color="neutral"
          variant="ghost"
          size="xs"
          :active="shadeEditor"
          active-color="primary"
          active-variant="subtle"
          :aria-label="`Adjust ${alias} shades`"
          @click="shadeEditor = !shadeEditor"
        />
      </UTooltip>
      <UTooltip text="Edit palette">
        <UButton
          icon="i-lucide-tangent"
          color="neutral"
          variant="ghost"
          size="xs"
          :active="paletteEditor"
          active-color="primary"
          active-variant="subtle"
          :aria-label="`Edit ${alias} palette`"
          @click="paletteEditor = !paletteEditor"
        />
      </UTooltip>
    </template>

    <div>
      <ThemeStudioColorMenu :alias="alias" />

      <ThemeStudioPaletteEditor v-model:open="paletteEditor" :alias="alias" />

      <!-- The accent pair for color aliases. -->
      <div v-if="shadeEditor && alias !== 'neutral'" class="flex flex-col gap-1.5 pt-2">
        <ThemeStudioRow
          v-for="(slider, modeName) in sections[0]!.sliders"
          :key="modeName"
          v-model="slider.model.value"
          control="shade"
          :mode="modeName"
          :chip="rampChip(alias)"
          :ladder="shadeLadder"
          resettable
          :dirty="slider.dirty.value"
          @reset="slider.reset()"
        />
      </div>

      <!-- Every neutral-ramped semantic token — background and text; borders
           moved to the Style panel's Borders section. -->
      <ThemeStudioTokenShades v-else-if="shadeEditor" :alias="alias" :groups="['background', 'text']" />
    </div>
  </ThemeStudioSection>
</template>
