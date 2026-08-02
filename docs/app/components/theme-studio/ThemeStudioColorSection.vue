<script setup lang="ts">
import type { ColorAlias, SectionKey } from '../../utils/theme-engine'

/**
 * One color alias: its picker, with the palette and shade editors folding out
 * under it. Aliases expose their accent pair; neutral its every token group.
 */
const props = defineProps<{
  alias: ColorAlias
  /** Header text — defaults to the capitalized alias. */
  label?: string
  helpTo?: string
  /** Passed through to the section header's reset affordance. */
  sectionKey?: SectionKey
}>()

const { rampChip } = useThemeStudio()
const { shadeLadder, sections } = useTokenShades(props.alias)

const title = computed(() => props.label ?? capitalize(props.alias))

const paletteEditor = ref(false)
const shadeEditor = ref(false)
</script>

<template>
  <ThemeStudioSection :label="title" :help-to="helpTo" :section-key="sectionKey">
    <template #actions>
      <UTooltip text="Adjust shades">
        <UButton
          icon="i-lucide-settings-2"
          color="neutral"
          variant="ghost"
          size="sm"
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
          size="sm"
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

      <UCollapsible v-model:open="shadeEditor">
        <template #content>
          <ThemeStudioSection
            v-if="alias !== 'neutral'"
            :label="`${title} shades`"
            resettable
            :reset-dirty="Object.values(sections[0]!.sliders).some(slider => slider.dirty.value)"
            @reset="Object.values(sections[0]!.sliders).forEach(slider => slider.reset())"
          >
            <ThemeStudioRow
              v-for="(slider, modeName) in sections[0]!.sliders"
              :key="modeName"
              v-model="slider.model.value"
              control="shade"
              :mode="modeName"
              :chip="rampChip(alias)"
              :ladder="shadeLadder"
            />
          </ThemeStudioSection>

          <!-- borders live in the Style panel's Borders section -->
          <ThemeStudioTokenShades v-else :alias="alias" :groups="['background', 'text']" />
        </template>
      </UCollapsible>
    </div>
  </ThemeStudioSection>
</template>
