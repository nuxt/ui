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
const { shadeLadder, sections } = useTokenShades(props.alias)

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

const editors = [
  { open: shadeEditor, icon: studioIcons.options, tooltip: 'Adjust shades', ariaLabel: `Adjust ${props.alias} shades` },
  { open: paletteEditor, icon: 'i-lucide-tangent', tooltip: 'Edit palette', ariaLabel: `Edit ${props.alias} palette` }
]
</script>

<template>
  <ThemeStudioSection :label="title" :help-to="helpTo" :section-key="sectionKey">
    <!-- the two editor folds: ghost until on, tinted while open -->
    <template #actions>
      <UTooltip
        v-for="editor in editors"
        :key="editor.tooltip"
        :text="editor.tooltip"
      >
        <UButton
          :icon="editor.icon"
          color="neutral"
          variant="ghost"
          size="sm"
          :active="editor.open.value"
          active-color="primary"
          active-variant="subtle"
          :aria-label="editor.ariaLabel"
          @click="editor.open.value = !editor.open.value"
        />
      </UTooltip>
    </template>

    <div>
      <ThemeStudioColorMenu :alias="alias" />

      <ThemeStudioColorPaletteEditor v-model:open="paletteEditor" :alias="alias" />

      <UCollapsible v-model:open="shadeEditor" :ui="{ content: 'overflow-hidden' }">
        <template #content>
          <!-- the padding sits inside the animated box, not on it -->
          <div class="pt-2">
            <ThemeStudioColorShadeGroup
              v-if="alias !== 'neutral'"
              :label="`${title} shades`"
              :sliders="sections[0]!.sliders"
              :chip="rampChip(alias)"
              :ladder="shadeLadder"
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
                  :ladder="shadeLadder"
                />
              </ThemeStudioSection>
            </div>
          </div>
        </template>
      </UCollapsible>
    </div>
  </ThemeStudioSection>
</template>
