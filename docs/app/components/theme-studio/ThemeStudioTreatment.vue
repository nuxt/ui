<script setup lang="ts">
import type { SectionKey } from '../../utils/theme-engine'
import type { ShadeSlider } from './ThemeStudioShadeGroup.vue'
import type { DefaultSelectItem } from './ThemeStudioDefaultSelect.vue'

/**
 * Shadow, inner shadow and borders are one shape: pick inherit / none /
 * custom, then tune. The knobs are the caller's — everything around them
 * (the fold-out, the colour source and its shades) is the same every time.
 */
defineProps<{
  label: string
  sectionKey?: SectionKey
  /** The inherit / none / custom choices; `custom` reveals the knobs. */
  options: { label: string, value: string }[]
  colorItems: DefaultSelectItem[]
  /** Names the colour fold-out; defaults to "<label> colour". */
  colorLabel?: string
  shades: Record<'light' | 'dark', ShadeSlider>
}>()

const model = defineModel<string>({ required: true })
const color = defineModel<string>('color', { required: true })

const { primaryChip, neutralChip } = useThemeStudio()

const shadeEditor = ref(false)

// Only a shade source rides a ramp — every other colour is a literal.
const onShade = computed(() => color.value === 'shade' || color.value === 'primary-shade')
const chip = computed(() => (color.value === 'primary-shade' ? primaryChip.value : neutralChip.value))
</script>

<template>
  <ThemeStudioSection :label="label" :section-key="sectionKey">
    <template v-if="model === 'custom'" #actions>
      <ThemeStudioActionToggle
        v-model="shadeEditor"
        icon="i-lucide-settings-2"
        tooltip="Adjust shades"
        :aria-label="`Adjust ${label} shades`"
      />
    </template>

    <div>
      <UTabs
        v-model="model"
        :items="options"
        :content="false"
        size="sm"
        color="primary"
        class="w-full"
      />

      <template v-if="model === 'custom'">
        <div class="mt-2 flex flex-col gap-2">
          <slot />
        </div>

        <!-- Outside the gap: a closed collapsible is still a flex child, and
             its gap would hang off the bottom of the panel. -->
        <UCollapsible v-model:open="shadeEditor">
          <template #content>
            <ThemeStudioShadeGroup
              :label="colorLabel ?? `${label} colour`"
              :sliders="shades"
              :chip="chip"
              :show-rows="onShade"
            >
              <ThemeStudioDefaultSelect
                v-model="color"
                :items="colorItems"
                icon="i-lucide-paint-bucket"
                class="w-full"
                :aria-label="`${label} color`"
              />
            </ThemeStudioShadeGroup>

            <slot name="shades" />
          </template>
        </UCollapsible>
      </template>
    </div>
  </ThemeStudioSection>
</template>
