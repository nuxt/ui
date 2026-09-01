<script setup lang="ts">
import type { ColorAlias } from '../../utils/theme/engine'
import { paletteLabel, rampCssName } from '../../utils/theme/studio'

/**
 * The shared color picker: a swatch-labelled trigger opening the palette
 * grid. Everything derives from the alias, so the studio sidebar and the
 * header popover render the exact same picker.
 */
const props = defineProps<{ alias: ColorAlias }>()

const appConfig = useAppConfig()
const { neutralColors, primaryColors, primary, neutral, blackAsPrimary, setBlackAsPrimary } = useTheme()
const { selectPalette, isCustomPalette } = useThemeStudio()

// Strictly separated for v4: color roles offer only chromatic ramps, the
// neutral role only gray ramps, the module's shade recipes differ per
// role, so a ramp can't cross over faithfully until v5.
const colors = computed(() => props.alias === 'neutral' ? neutralColors : primaryColors)

const value = computed(() => {
  if (props.alias === 'primary') return blackAsPrimary.value ? 'black' : primary.value
  if (props.alias === 'neutral') return neutral.value
  return (appConfig.ui.colors as Record<string, string>)[props.alias] || props.alias
})

const label = computed(() => {
  if (props.alias === 'primary' && blackAsPrimary.value) return 'Black'
  return isCustomPalette(props.alias) ? 'Custom' : paletteLabel(value.value)
})

const swatchColor = computed(() => {
  if (props.alias === 'primary' && blackAsPrimary.value) return undefined
  if (isCustomPalette(props.alias)) return `var(--color-custom-${props.alias}-500)`
  return `var(--color-${rampCssName(value.value)}-500)`
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
      <div class="w-72 p-2">
        <div class="grid grid-cols-3 gap-1">
          <UButton
            v-if="alias === 'primary'"
            label="Black"
            size="sm"
            color="neutral"
            variant="subtle"
            :active="blackAsPrimary"
            active-color="primary"
            active-variant="subtle"
            class="capitalize"
            @click="setBlackAsPrimary(true)"
          >
            <template #leading>
              <span class="inline-block h-2 w-4 rounded-full bg-black dark:bg-white" />
            </template>
          </UButton>

          <UButton
            v-for="color in colors"
            :key="color"
            :label="paletteLabel(color)"
            size="sm"
            color="neutral"
            variant="subtle"
            :active="isSelected(color)"
            active-color="primary"
            active-variant="subtle"
            class="capitalize"
            @click="selectPalette(alias, color)"
          >
            <template #leading>
              <!-- a mini 400→600 ramp says more about a palette than one dot -->
              <span
                class="inline-block h-2 w-4 rounded-full"
                :style="{
                  background: `linear-gradient(to right, var(--color-${rampCssName(color)}-400), var(--color-${rampCssName(color)}-500), var(--color-${rampCssName(color)}-600))`
                }"
              />
            </template>
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>
