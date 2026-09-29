<script setup lang="ts">
import type { ColorAlias } from '../../../utils/theme/engine'
import { paletteLabel, paletteShade } from '../../../utils/theme/studio'

/**
 * The shared color picker: a swatch-labelled trigger opening the palette
 * grid. Everything derives from the alias, so the studio sidebar and the
 * header popover render the exact same picker.
 */
const props = defineProps<{
  alias: ColorAlias
  /** Hovering a palette previews it on the page, picking it applies it. */
  preview?: boolean
}>()

const appConfig = useAppConfig()
const { neutralColors, primaryColors, primary, neutral } = useTheme()
const { selectPalette, isCustomPalette } = useThemeStudio()

// Strictly separated for v4: color roles offer only chromatic ramps, the
// neutral role only gray ramps, the module's shade recipes differ per
// role, so a ramp can't cross over faithfully until v5.
const colors = computed(() => props.alias === 'neutral' ? neutralColors : primaryColors)

const live = computed(() => {
  if (isCustomPalette(props.alias)) return 'custom'
  if (props.alias === 'primary') return primary.value
  if (props.alias === 'neutral') return neutral.value
  return (appConfig.colors as Record<string, string>)[props.alias] || props.alias
})

// the applied palette, held while a preview runs so the trigger and the
// active swatch stay on it
const value = useHeldDuringPreview(() => live.value)

const label = computed(() => paletteLabel(value.value))

const swatchColor = computed(() => {
  if (value.value === 'custom') return `var(--color-custom-${props.alias}-500)`
  return paletteShade(value.value, 500)
})

function isSelected(color: string) {
  return value.value === color
}

const open = ref(false)
const { show, cancel, commit } = useThemePreview()

watch(open, (isOpen) => {
  if (!isOpen) cancel()
})

/**
 * Hovering previews a palette, the applied one previews nothing. Pointer
 * only: the popover focuses its first swatch on open, a focus preview would
 * repaint the page before anything was pointed at.
 */
function hover(color: string) {
  if (!props.preview || color === value.value) return show()
  show(() => selectPalette(props.alias, color))
}
</script>

<template>
  <UPopover
    v-model:open="open"
    :content="{ side: 'bottom', align: 'center' }"
    :ui="{ content: 'p-2 grid grid-cols-3 gap-1 w-[calc(var(--reka-popover-trigger-width)+1rem)]' }"
  >
    <UButton
      color="neutral"
      variant="subtle"
      size="sm"
      :label="label"
      block
      :trailing-icon="appConfig.ui.icons.chevronDown"
      class="capitalize group"
      :style="{ '--swatch-color': swatchColor }"
      :ui="{ trailingIcon: 'text-dimmed transition-transform duration-200 group-data-[state=open]:rotate-180' }"
    >
      <template #leading>
        <!-- the chip can't take an inline style, the var rides the button -->
        <UChip
          inset
          standalone
          class="mx-1"
          :ui="{ base: 'ring-0 bg-(--swatch-color)' }"
        />
      </template>
    </UButton>

    <template #content>
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
        @pointerenter="hover(color)"
        @pointerleave="show()"
        @click="commit(() => selectPalette(alias, color))"
      >
        <template #leading>
          <!-- a mini 400→600 ramp says more about a palette than one dot -->
          <span
            class="inline-block h-2 w-3 shrink-0 rounded-full"
            :style="{
              background: `linear-gradient(to right, ${paletteShade(color, 400)}, ${paletteShade(color, 500)}, ${paletteShade(color, 600)})`
            }"
          />
        </template>
      </UButton>
    </template>
  </UPopover>
</template>
