<script setup lang="ts">
import type { ColorAlias, SectionKey } from '../../utils/theme-engine'

/**
 * One color alias: its picker, with the palette and shade editors folding out
 * under it. Aliases expose their accent pair; neutral its every token group.
 */
const props = withDefaults(defineProps<{
  alias: ColorAlias
  /** Header text — defaults to the capitalized alias. */
  label?: string
  helpTo?: string
  /** Passed through to the section header's reset affordance. */
  sectionKey?: SectionKey
  /** Nested under a fold already — see ThemeStudioSection. */
  collapsible?: boolean
}>(), {
  // absent must stay undefined so the section's depth rule still decides
  collapsible: undefined
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
      <ThemeStudioActionToggle
        v-model="shadeEditor"
        icon="i-lucide-settings-2"
        tooltip="Adjust shades"
        :aria-label="`Adjust ${alias} shades`"
      />

      <ThemeStudioActionToggle
        v-model="paletteEditor"
        icon="i-lucide-tangent"
        tooltip="Edit palette"
        :aria-label="`Edit ${alias} palette`"
      />
    </template>

    <div>
      <ThemeStudioColorMenu :alias="alias" />

      <ThemeStudioPaletteEditor v-model:open="paletteEditor" :alias="alias" />

      <!-- padding, not a margin: it has to sit inside the animated box -->
      <UCollapsible v-model:open="shadeEditor" :ui="{ content: 'overflow-hidden pt-2' }">
        <template #content>
          <ThemeStudioShadeGroup
            v-if="alias !== 'neutral'"
            :label="`${title} shades`"
            :sliders="sections[0]!.sliders"
            :chip="rampChip(alias)"
            :ladder="shadeLadder"
          />

          <!-- borders live in the Style panel's Borders section -->
          <ThemeStudioTokenShades v-else :alias="alias" :groups="['background', 'text']" />
        </template>
      </UCollapsible>
    </div>
  </ThemeStudioSection>
</template>
