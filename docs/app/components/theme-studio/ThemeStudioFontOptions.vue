<script setup lang="ts">
import { FONT_WEIGHT_DEFAULTS } from '../../utils/theme'

/** Everything about type beyond the base family: weights, case, tracking, leading. */
const { fonts, font, fontPrefs, setFontPrefs } = useTheme()

onMounted(() => loadFontPreviews(fonts))

// One writable model per tailwind weight step — the knobs components
// actually dereference at runtime.
function weightStepModel(step: keyof typeof FONT_WEIGHT_DEFAULTS) {
  return computed({
    get: () => fontPrefs.value.weights?.[step] ?? FONT_WEIGHT_DEFAULTS[step],
    set: (value: number) => setFontPrefs({ ...fontPrefs.value, weights: { ...fontPrefs.value.weights, [step]: value } })
  })
}

const WEIGHT_STEPS = ['normal', 'medium', 'semibold', 'bold'] as const
const weightSteps = Object.fromEntries(WEIGHT_STEPS.map(step => [step, weightStepModel(step)])) as Record<typeof WEIGHT_STEPS[number], ReturnType<typeof weightStepModel>>
const weightsActive = computed(() => !!fontPrefs.value.weights)

function setHeading(patch: Record<string, unknown>) {
  setFontPrefs({ ...fontPrefs.value, heading: { ...fontPrefs.value.heading, ...patch } })
}

const headingFont = computed({
  get: () => fontPrefs.value.heading?.font ?? 'inherit',
  set: (value: string) => setHeading({ font: value === 'inherit' ? undefined : value })
})

const headingWeight = computed({
  get: () => fontPrefs.value.heading?.weight ?? 700,
  set: (value: number) => setHeading({ weight: value })
})

const headingUppercase = computed({
  get: () => !!fontPrefs.value.heading?.uppercase,
  set: (value: boolean) => setHeading({ uppercase: value })
})

const baseUppercase = computed({
  get: () => !!fontPrefs.value.uppercase,
  set: (value: boolean) => setFontPrefs({ ...fontPrefs.value, uppercase: value })
})

const baseLetterSpacing = computed({
  get: () => fontPrefs.value.letterSpacing ?? 0,
  set: (value: number) => setFontPrefs({ ...fontPrefs.value, letterSpacing: value })
})

const baseLineHeight = computed({
  get: () => fontPrefs.value.lineHeight ?? 1.5,
  set: (value: number) => setFontPrefs({ ...fontPrefs.value, lineHeight: value })
})

const headingLetterSpacing = computed({
  get: () => fontPrefs.value.heading?.letterSpacing ?? 0,
  set: (value: number) => setHeading({ letterSpacing: value })
})

// Headings natively lead at ~1.25 (the specimen agrees) — 1.5 here would
// show a value the page isn't actually rendering.
const headingLineHeight = computed({
  get: () => fontPrefs.value.heading?.lineHeight ?? 1.25,
  set: (value: number) => setHeading({ lineHeight: value })
})

// Base and Headings are one template over different models; base tunes the
// four tailwind weight steps, headings a single weight.
const fontRows = [{
  key: 'base',
  label: 'Base',
  defaultValue: 'Public Sans',
  selectIcon: 'i-lucide-type',
  font,
  weights: WEIGHT_STEPS.map(step => ({ label: capitalize(step), model: weightSteps[step]!, min: 100, max: 900 })),
  weightsActive,
  uppercase: baseUppercase,
  letterSpacing: baseLetterSpacing,
  lineHeight: baseLineHeight,
  lineHeightDefault: 1.5,
  aria: { weights: 'Font weights', uppercase: 'Uppercase text', spacing: 'Letter spacing', height: 'Line height' }
}, {
  key: 'heading',
  label: 'Headings (Prose)',
  defaultValue: 'inherit',
  selectIcon: 'i-lucide-heading',
  font: headingFont,
  weights: [{ label: 'Weight', model: headingWeight, min: 100, max: 900 }],
  weightsActive: computed(() => fontPrefs.value.heading?.weight !== undefined),
  uppercase: headingUppercase,
  letterSpacing: headingLetterSpacing,
  lineHeight: headingLineHeight,
  lineHeightDefault: 1.25,
  aria: { weights: 'Heading weight', uppercase: 'Uppercase headings', spacing: 'Heading letter spacing', height: 'Heading line height' }
}]

/** Live specimen: a heading line in the heading treatment over a body line. */
const headingSampleStyle = computed(() => ({
  fontFamily: `'${fontPrefs.value.heading?.font ?? font.value}', sans-serif`,
  fontWeight: fontPrefs.value.heading?.weight ?? 700,
  textTransform: (fontPrefs.value.heading?.uppercase || fontPrefs.value.uppercase) ? 'uppercase' as const : undefined,
  fontStyle: (fontPrefs.value.heading?.italic || fontPrefs.value.italic) ? 'italic' as const : undefined,
  textDecoration: fontPrefs.value.heading?.underline ? 'underline' as const : undefined,
  letterSpacing: `${fontPrefs.value.heading?.letterSpacing ?? fontPrefs.value.letterSpacing ?? 0}em`,
  lineHeight: fontPrefs.value.heading?.lineHeight ?? 1.25
}))
const bodySampleStyle = computed(() => ({
  fontFamily: `'${font.value}', sans-serif`,
  fontWeight: fontPrefs.value.weights?.normal ?? 400,
  textTransform: fontPrefs.value.uppercase ? 'uppercase' as const : undefined,
  fontStyle: fontPrefs.value.italic ? 'italic' as const : undefined,
  letterSpacing: `${fontPrefs.value.letterSpacing ?? 0}em`,
  lineHeight: fontPrefs.value.lineHeight ?? 1.5
}))
</script>

<template>
  <div class="flex flex-col gap-2">
    <template v-for="row in fontRows" :key="row.key">
      <span class="text-xs font-medium text-muted select-none" :class="row.key === 'heading' && 'pt-1'">{{ row.label }}</span>

      <div class="flex items-center gap-1.5">
        <!-- each family renders itself over a live specimen line;
             searching reaches the full Google Fonts catalog -->
        <ThemeStudioFontPicker
          v-model="row.font.value"
          :curated="fonts"
          :default-value="row.defaultValue"
          :inherit="row.key === 'heading'"
          :icon="row.selectIcon"
          size="md"
          :aria-label="`${row.label} font`"
          class="flex-1 min-w-0"
        />

        <UFieldGroup size="md">
          <UPopover :content="{ align: 'start' }">
            <UTooltip :text="row.weights.length > 1 ? 'Weights' : 'Weight'">
              <UButton
                icon="i-lucide-bold"
                color="neutral"
                variant="subtle"
                :active="row.weightsActive.value"
                active-color="primary"
                active-variant="subtle"
                :aria-label="row.aria.weights"
              />
            </UTooltip>

            <template #content>
              <div class="w-64 p-3 flex flex-col gap-1.5">
                <ThemeStudioRow
                  v-for="weight in row.weights"
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
              variant="subtle"
              :active="row.uppercase.value"
              active-color="primary"
              active-variant="subtle"
              :aria-label="row.aria.uppercase"
              @click="row.uppercase.value = !row.uppercase.value"
            />
          </UTooltip>

          <UPopover :content="{ align: 'start' }">
            <UTooltip text="Letter spacing">
              <UButton
                icon="i-lucide-move-horizontal"
                color="neutral"
                variant="subtle"
                :active="row.letterSpacing.value !== 0"
                active-color="primary"
                active-variant="subtle"
                :aria-label="row.aria.spacing"
              />
            </UTooltip>

            <template #content>
              <ThemeStudioRow
                v-model="row.letterSpacing.value"
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
                variant="subtle"
                :active="row.lineHeight.value !== row.lineHeightDefault"
                active-color="primary"
                active-variant="subtle"
                :aria-label="row.aria.height"
              />
            </UTooltip>

            <template #content>
              <ThemeStudioRow
                v-model="row.lineHeight.value"
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

    <!-- live specimen: the heading treatment over the base body -->
    <div class="rounded-md ring ring-default bg-elevated/50 px-3 py-2 mt-2 select-none">
      <p class="text-sm text-highlighted truncate" :style="headingSampleStyle">
        Grumpy wizards make toxic brew
      </p>
      <p class="text-xs text-muted truncate" :style="bodySampleStyle">
        The quick brown fox jumps over the lazy dog 0123456789
      </p>
    </div>
  </div>
</template>
