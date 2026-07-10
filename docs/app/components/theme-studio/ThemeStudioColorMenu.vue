<script setup lang="ts">
import type { ColorAlias } from '../../utils/theme-engine'

/**
 * The shared color picker: a swatch-labelled trigger opening the sectioned
 * palette grid. Everything derives from the alias, so the studio sidebar
 * and the header popover render the exact same picker.
 */
const props = defineProps<{ alias: ColorAlias }>()

const appConfig = useAppConfig()
const { neutralColors, primaryColors, primary, neutral, blackAsPrimary, setBlackAsPrimary } = useTheme()
const { selectPalette, isCustomPalette } = useThemeStudio()

// Colorful ramps lead for color roles, neutrals lead for the background.
// Primary offers no gray ramps at all: a gray through the chromatic shade
// recipe is a washed-out accent, so the single Neutral entry (mapping to
// the neutral alias) replaces them.
const sections = computed(() => {
  if (props.alias === 'neutral') {
    return [
      { label: 'Neutrals', colors: neutralColors },
      { label: 'Colors', colors: primaryColors, hint: 'These may need some adjustment for comfortable use, try the modifiers in the palette editor.' }
    ]
  }
  if (props.alias === 'primary') return [{ label: 'Colors', colors: primaryColors }]
  return [{ label: 'Colors', colors: primaryColors }, { label: 'Neutrals', colors: neutralColors }]
})

const value = computed(() => {
  if (props.alias === 'primary') return blackAsPrimary.value ? 'black' : primary.value
  if (props.alias === 'neutral') return neutral.value
  return (appConfig.ui.colors as Record<string, string>)[props.alias] || props.alias
})

const label = computed(() => {
  if (props.alias === 'primary' && blackAsPrimary.value) return 'Black'
  return isCustomPalette(props.alias) ? 'Custom' : value.value
})

/** Palette name → the css var chip name (tailwind's neutral gray is remapped in docs). */
function paletteChip(name: string) {
  return name === 'neutral' ? 'old-neutral' : name
}

const swatchColor = computed(() => {
  if (props.alias === 'primary' && blackAsPrimary.value) return undefined
  // primary set to the neutral alias mirrors the selected neutral ramp
  if (props.alias === 'primary' && value.value === 'neutral') return 'var(--ui-color-neutral-500)'
  if (isCustomPalette(props.alias)) return `var(--color-custom-${props.alias}-500)`
  return `var(--color-${paletteChip(value.value)}-500)`
})

/** What the primary menu's Neutral row resolves to right now. */
const neutralName = computed(() => isCustomPalette('neutral') ? 'Custom' : neutral.value)

function isSelected(color: string) {
  if (props.alias === 'primary') return !blackAsPrimary.value && primary.value === color
  if (props.alias === 'neutral') return neutral.value === color
  return value.value === color
}
</script>

<template>
  <UPopover :content="{ side: 'bottom', align: 'start' }">
    <UButton
      color="neutral"
      variant="subtle"
      size="sm"
      block
      trailing-icon="i-lucide-chevron-down"
      class="capitalize"
    >
      <template #leading>
        <span
          class="inline-block size-3 rounded-full"
          :class="{ 'bg-black dark:bg-white': alias === 'primary' && blackAsPrimary }"
          :style="swatchColor ? { backgroundColor: swatchColor } : undefined"
        />
      </template>

      {{ label }}
    </UButton>

    <template #content>
      <div class="flex flex-col gap-3 w-72 p-2">
        <!-- Not a ramp swatch: primary follows whatever the neutral alias
             resolves to, so it gets a distinct full-width row. -->
        <ThemeStudioPickerButton
          v-if="alias === 'primary'"
          size="xs"
          :selected="!blackAsPrimary && primary === 'neutral'"
          class="w-full"
          @click="selectPalette(alias, 'neutral')"
        >
          <template #leading>
            <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: 'var(--ui-color-neutral-500)' }" />
          </template>

          Neutral <span class="text-muted">({{ neutralName }})</span>
        </ThemeStudioPickerButton>

        <div v-for="(section, index) in sections" :key="section.label">
          <p class="text-[11px] font-semibold text-muted px-1 mb-0.5 select-none">
            {{ section.label }}
          </p>

          <p v-if="section.hint" class="text-[10px] text-muted px-1 mb-1 select-none">
            {{ section.hint }}
          </p>

          <div class="grid grid-cols-3 gap-1">
            <ThemeStudioPickerButton
              v-if="alias === 'primary' && index === 0"
              label="Black"
              size="xs"
              :selected="blackAsPrimary"
              @click="setBlackAsPrimary(true)"
            >
              <template #leading>
                <span class="inline-block size-2 rounded-full bg-black dark:bg-white" />
              </template>
            </ThemeStudioPickerButton>

            <ThemeStudioPickerButton
              v-for="color in section.colors"
              :key="color"
              :label="color"
              size="xs"
              :chip="paletteChip(color)"
              :selected="isSelected(color)"
              @click="selectPalette(alias, color)"
            />
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>
