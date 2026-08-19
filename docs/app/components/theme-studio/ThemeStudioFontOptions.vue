<script setup lang="ts">
import { FONT_WEIGHT_DEFAULTS, loadFontPreviews } from '../../utils/theme/studio'

/**
 * The font control: the family select joined to a single dropdown holding
 * the type modifiers (case, tracking, leading, weights). The picker is
 * already a popover, so wrapping it in another one to hold a select was a
 * popover inside a popover.
 *
 * Heading and Code are rows in that dropdown rather than two more selects in
 * the bar, which is what made it feel heavy before. They set tailwind's
 * `--font-serif` and `--font-mono`: mono needs nothing else (preflight points
 * `code`/`kbd`/`pre`/`samp` at it), serif drives the h1–h6 rule in main.css
 * until v5 ships `--ui-font-heading`.
 */
defineProps<{ tooltip?: string }>()

/** Exposed so the fullscreen toolbar can pin itself while the list is open. */
const open = defineModel<boolean>('open', { default: false })

const { fonts, headingFonts, monoFonts, font, fontPrefs, setFontPrefs } = useTheme()

onMounted(() => loadFontPreviews([...fonts, ...headingFonts, ...monoFonts]))

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

/**
 * Tailwind's other two stacks, labelled by what they do rather than by their
 * variable: serif is the heading family, mono is code. `undefined` (not the
 * string) is inherit, so an untouched row exports clean.
 */
function stackModel(key: 'serif' | 'mono') {
  return computed({
    get: () => fontPrefs.value[key] ?? 'inherit',
    set: (value: string) => setFontPrefs({ ...fontPrefs.value, [key]: value === 'inherit' ? undefined : value })
  })
}

const headingFont = stackModel('serif')
const monoFont = stackModel('mono')

// One trigger for every control below it, so it has to carry their combined state.
const modified = computed(() => weightsActive.value || uppercase.value || letterSpacing.value !== 0 || lineHeight.value !== 1.5 || headingFont.value !== 'inherit' || monoFont.value !== 'inherit')
</script>

<template>
  <!-- the select and the modifiers read as one control, so they share a
       field group rather than sitting apart -->
  <UFieldGroup>
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

    <UPopover :content="{ align: 'end' }">
      <UTooltip text="Type options">
        <UButton
          icon="i-lucide-a-large-small"
          color="neutral"
          variant="outline"
          :active="modified"
          active-color="primary"
          active-variant="subtle"
          aria-label="Type options"
        />
      </UTooltip>

      <template #content>
        <div class="w-64 p-3 flex flex-col gap-1.5">
          <!-- pairing a display face with the body text is the highest-leverage
               type choice here, so headings lead the panel -->
          <ThemeStudioRow control="custom" label="Heading">
            <ThemeStudioFontPicker
              v-model="headingFont"
              :curated="headingFonts"
              default-value="inherit"
              inherit
              size="xs"
              aria-label="Heading font"
              class="w-full"
            />
          </ThemeStudioRow>

          <ThemeStudioRow control="custom" label="Code">
            <ThemeStudioFontPicker
              v-model="monoFont"
              :curated="monoFonts"
              default-value="inherit"
              inherit
              size="xs"
              aria-label="Code font"
              class="w-full"
            />
          </ThemeStudioRow>

          <USeparator class="my-1" />

          <ThemeStudioRow
            v-model="uppercase"
            control="switch"
            label="Uppercase"
          />

          <ThemeStudioRow
            v-model="letterSpacing"
            control="slider"
            label="Spacing"
            :min="-0.05"
            :max="0.25"
            :step="0.005"
            unit="em"
          />

          <ThemeStudioRow
            v-model="lineHeight"
            control="slider"
            label="Height"
            :min="1"
            :max="2"
            :step="0.05"
          />

          <USeparator class="my-1" />

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
  </UFieldGroup>
</template>
