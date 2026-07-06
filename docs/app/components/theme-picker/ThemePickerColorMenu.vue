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

// Every ramp suits either role — colorful ramps lead for color roles,
// neutrals lead for the background.
const sections = computed(() => props.alias === 'neutral'
  ? [{ label: 'Neutrals', colors: neutralColors }, { label: 'Colors', colors: primaryColors }]
  : [{ label: 'Colors', colors: primaryColors }, { label: 'Neutrals', colors: neutralColors }])

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
  if (isCustomPalette(props.alias)) return `var(--color-custom-${props.alias}-500)`
  return `var(--color-${paletteChip(value.value)}-500)`
})

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
      <div class="flex flex-col gap-2 w-72 p-2">
        <div v-for="(section, index) in sections" :key="section.label">
          <p class="text-[11px] font-semibold text-muted px-1 mb-1 select-none">
            {{ section.label }}
          </p>

          <div class="grid grid-cols-3 gap-1">
            <ThemePickerButton
              v-if="alias === 'primary' && index === 0"
              label="Black"
              :selected="blackAsPrimary"
              @click="setBlackAsPrimary(true)"
            >
              <template #leading>
                <span class="inline-block size-2 rounded-full bg-black dark:bg-white" />
              </template>
            </ThemePickerButton>

            <ThemePickerButton
              v-for="color in section.colors"
              :key="color"
              :label="color"
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
