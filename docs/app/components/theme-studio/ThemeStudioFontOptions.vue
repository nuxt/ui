<script setup lang="ts">
import { FONT_WEIGHT_DEFAULTS } from '../../utils/theme'

/**
 * The font control: the family select itself, not a panel, with the type
 * modifiers (weights, case, tracking, leading) beside it. The picker is
 * already a popover, so wrapping it in another one to hold a select was a
 * popover inside a popover.
 *
 * Heading treatment has no control here any more. Presets still set
 * `fontPrefs.heading` (Parchment pairs Source Serif 4 with DM Sans) and the
 * engine still exports it, it just isn't a knob in the bar.
 */
defineProps<{ tooltip?: string }>()

/** Exposed so the fullscreen toolbar can pin itself while the list is open. */
const open = defineModel<boolean>('open', { default: false })

const { fonts, font, fontPrefs, setFontPrefs } = useTheme()

onMounted(() => loadFontPreviews(fonts))

// One writable model per tailwind weight step, the knobs components
// actually dereference at runtime.
function weightStepModel(step: keyof typeof FONT_WEIGHT_DEFAULTS) {
  return computed({
    get: () => fontPrefs.value.weights?.[step] ?? FONT_WEIGHT_DEFAULTS[step],
    set: (value: number) => setFontPrefs({ ...fontPrefs.value, weights: { ...fontPrefs.value.weights, [step]: value } })
  })
}

const WEIGHT_STEPS = ['normal', 'medium', 'semibold', 'bold'] as const
const weightSteps = Object.fromEntries(WEIGHT_STEPS.map(step => [step, weightStepModel(step)])) as Record<typeof WEIGHT_STEPS[number], ReturnType<typeof weightStepModel>>
const weights = WEIGHT_STEPS.map(step => ({ label: capitalize(step), model: weightSteps[step]!, min: 100, max: 900 }))
const weightsActive = computed(() => !!fontPrefs.value.weights)

const uppercase = computed({
  get: () => !!fontPrefs.value.uppercase,
  set: (value: boolean) => setFontPrefs({ ...fontPrefs.value, uppercase: value })
})

const letterSpacing = computed({
  get: () => fontPrefs.value.letterSpacing ?? 0,
  set: (value: number) => setFontPrefs({ ...fontPrefs.value, letterSpacing: value })
})

const lineHeight = computed({
  get: () => fontPrefs.value.lineHeight ?? 1.5,
  set: (value: number) => setFontPrefs({ ...fontPrefs.value, lineHeight: value })
})
</script>

<template>
  <div class="flex items-center gap-1.5">
    <!-- each family renders itself over a live specimen line;
         searching reaches the full Google Fonts catalog -->
    <ThemeStudioFontPicker
      v-model="font"
      v-model:open="open"
      :curated="fonts"
      default-value="Public Sans"
      icon="i-lucide-type"
      :tooltip="tooltip"
      variant="outline"
      aria-label="Font family"
      class="w-38"
    />

    <UFieldGroup>
      <UPopover :content="{ align: 'start' }">
        <UTooltip text="Weights">
          <UButton
            icon="i-lucide-bold"
            color="neutral"
            variant="outline"
            :active="weightsActive"
            active-color="primary"
            active-variant="subtle"
            aria-label="Font weights"
          />
        </UTooltip>

        <template #content>
          <div class="w-64 p-3 flex flex-col gap-1.5">
            <ThemeStudioRow
              v-for="weight in weights"
              :key="weight.label"
              v-model="weight.model.value"
              control="slider"
              :label="weight.label"
              :min="weight.min"
              :max="weight.max"
              :step="25"
            />
          </div>
        </template>
      </UPopover>

      <UTooltip text="Uppercase">
        <UButton
          icon="i-lucide-case-upper"
          color="neutral"
          variant="outline"
          :active="uppercase"
          active-color="primary"
          active-variant="subtle"
          aria-label="Uppercase text"
          @click="uppercase = !uppercase"
        />
      </UTooltip>

      <UPopover :content="{ align: 'start' }">
        <UTooltip text="Letter spacing">
          <UButton
            icon="i-lucide-move-horizontal"
            color="neutral"
            variant="outline"
            :active="letterSpacing !== 0"
            active-color="primary"
            active-variant="subtle"
            aria-label="Letter spacing"
          />
        </UTooltip>

        <template #content>
          <ThemeStudioRow
            v-model="letterSpacing"
            control="slider"
            label="Spacing"
            :min="-0.05"
            :max="0.25"
            :step="0.005"
            unit="em"
            class="w-64 p-3"
          />
        </template>
      </UPopover>

      <UPopover :content="{ align: 'start' }">
        <UTooltip text="Line height">
          <UButton
            icon="i-lucide-move-vertical"
            color="neutral"
            variant="outline"
            :active="lineHeight !== 1.5"
            active-color="primary"
            active-variant="subtle"
            aria-label="Line height"
          />
        </UTooltip>

        <template #content>
          <ThemeStudioRow
            v-model="lineHeight"
            control="slider"
            label="Height"
            :min="1"
            :max="2"
            :step="0.05"
            class="w-64 p-3"
          />
        </template>
      </UPopover>
    </UFieldGroup>
  </div>
</template>
