<script setup lang="ts">
import { upperFirst } from 'scule'
import type { ColorAlias, SectionKey } from '../../../utils/theme/engine'

/**
 * One color alias: its picker, with the palette and shade editors folding out
 * under it. Every alias exposes its solid, accents their text pair too.
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
const { sections: tokenSections, readable, readableApplied, applyReadable } = useTokenShades(props.alias)

const title = computed(() => props.label ?? upperFirst(props.alias))

const paletteEditor = ref(false)
const shadeEditor = ref(false)

// Neutral's background, text and border shades have their own toolbar panel.
const sections = tokenSections.filter(section => section.group === 'colors')

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
          <div class="flex flex-col gap-2">
            <ThemeStudioColorShadeGroup
              v-for="section in sections"
              :key="section.token"
              :label="section.follows ? `${title} ${section.label.toLowerCase()}` : `${title} shades`"
              :sliders="section.sliders"
              :chip="rampChip(alias)"
            />

            <!-- neutral text is the page text, no pair of its own to show here -->
            <p v-if="alias === 'neutral'" class="text-xs text-muted">
              Neutral text, backgrounds and borders are set in Surfaces.
            </p>

            <!-- The text sliders follow the solid until one is moved, this
                 picks the first shade that reads at 4.5:1 in light mode. -->
            <UTooltip
              v-if="readable"
              text="The lightest shade with 4.5:1 contrast on the page and on soft fills, in light mode"
              ignore-non-keyboard-focus
            >
              <UButton
                :label="readableApplied ? `AA text on ${readable}` : `Use AA text (${readable})`"
                :icon="studioIcons.contrast"
                color="neutral"
                variant="soft"
                size="sm"
                block
                :disabled="readableApplied"
                @click="applyReadable"
              />
            </UTooltip>
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
