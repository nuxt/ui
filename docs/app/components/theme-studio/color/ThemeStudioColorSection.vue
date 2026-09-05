<script setup lang="ts">
import { upperFirst } from 'scule'
import { TOKEN_GROUPS } from '../../../utils/theme/engine'
import type { ColorAlias, SectionKey } from '../../../utils/theme/engine'

/**
 * One color alias: its picker, with the palette and shade editors folding out
 * under it. Aliases expose their accent pair; neutral its every token group.
 */
const props = defineProps<{
  alias: ColorAlias
  /** Header text, defaults to the capitalized alias. */
  label?: string
  helpTo?: string
  /** Passed through to the section header's reset affordance. */
  sectionKey?: SectionKey
}>()

const { rampChip } = useThemeStudio()
const { sections } = useTokenShades(props.alias)

const title = computed(() => props.label ?? upperFirst(props.alias))

const paletteEditor = ref(false)
const shadeEditor = ref(false)

// Neutral rides every semantic token, so its shades come grouped rather than
// as one accent pair. Border tokens are deliberately not exposed here, their
// sliders would double the group with no visible payoff.
const NEUTRAL_GROUPS = ['background', 'text']
const tokenGroups = TOKEN_GROUPS
  .filter(group => NEUTRAL_GROUPS.includes(group.key))
  .map(group => ({ ...group, sections: sections.filter(section => section.group === group.key) }))
  .filter(group => group.sections.length)

const studioIcons = useStudioIcons()

// Both editors open beside the list rather than inside it: the curve editor
// alone is taller than the panel, and expanding in place pushed every other
// alias out of view. Reka stacks dismissable layers, so a nested popover
// leaves the panel behind it open (same as the palette menu one row down).
const editorPanel = 'w-72 max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto p-3'
const editorContent = { side: 'right' as const, align: 'start' as const, alignOffset: -8, collisionPadding: 8 }
</script>

<template>
  <ThemeStudioSection :label="title" :help-to="helpTo" :section-key="sectionKey">
    <template #actions>
      <UPopover v-model:open="shadeEditor" :content="editorContent" :ui="{ content: editorPanel }">
        <UTooltip text="Adjust shades" ignore-non-keyboard-focus>
          <UButton
            :icon="studioIcons.options"
            color="neutral"
            variant="ghost"
            size="sm"
            :active="shadeEditor"
            active-color="primary"
            active-variant="subtle"
            :aria-label="`Adjust ${alias} shades`"
          />
        </UTooltip>

        <template #content>
          <ThemeStudioColorShadeGroup
            v-if="alias !== 'neutral'"
            :label="`${title} shades`"
            :sliders="sections[0]!.sliders"
            :chip="rampChip(alias)"
          />

          <!-- Every group keeps its name: a headerless section can't be
               told apart from the rows above it. -->
          <div v-else class="flex flex-col gap-2">
            <ThemeStudioSection
              v-for="tokenGroup in tokenGroups"
              :key="tokenGroup.key"
              :label="tokenGroup.label"
            >
              <ThemeStudioColorShadeGroup
                v-for="section in tokenGroup.sections"
                :key="section.token"
                :label="`${tokenGroup.label.replace(/ shades$/, '')} ${section.label.toLowerCase()}`"
                :sliders="section.sliders"
                :chip="rampChip(section.ramp)"
              />
            </ThemeStudioSection>
          </div>
        </template>
      </UPopover>

      <UPopover v-model:open="paletteEditor" :content="editorContent" :ui="{ content: editorPanel }">
        <UTooltip text="Edit palette" ignore-non-keyboard-focus>
          <UButton
            :icon="studioIcons.curve"
            color="neutral"
            variant="ghost"
            size="sm"
            :active="paletteEditor"
            active-color="primary"
            active-variant="subtle"
            :aria-label="`Edit ${alias} palette`"
          />
        </UTooltip>

        <template #content>
          <ThemeStudioColorPaletteEditor :alias="alias" />
        </template>
      </UPopover>
    </template>

    <ThemeStudioColorMenu :alias="alias" />
  </ThemeStudioSection>
</template>
