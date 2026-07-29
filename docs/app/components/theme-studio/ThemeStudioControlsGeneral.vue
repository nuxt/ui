<script setup lang="ts">
import { themeIcons, FONT_WEIGHT_DEFAULTS } from '../../utils/theme'
import type { VariantGroup } from '../../utils/theme-engine'

const {
  radius,
  fontSize,
  spacing,
  fonts,
  font,
  fontPrefs,
  setFontPrefs,
  icon,
  icons
} = useTheme()

const { style, setStyle } = useThemeStudio()

/* ------------------------------------------------------------ typography -- */

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

/* ---------------------------------------------------------------- icons -- */

/** A representative spread from the selected set for the preview grid. */
const SAMPLE_ICON_KEYS = ['search', 'check', 'close', 'warning', 'error', 'info', 'tip', 'light', 'dark', 'external', 'plus', 'minus', 'loading', 'copy', 'file', 'folder', 'eye', 'star', 'upload', 'menu', 'ellipsis', 'reload', 'arrowRight', 'chevronDown']
const iconPreviews = computed(() => {
  const set = (themeIcons as Record<string, Record<string, string>>)[icon.value] || {}
  return SAMPLE_ICON_KEYS.map(key => set[key]).filter((name): name is string => !!name).slice(0, 20)
})

/** A short strip of a set's own glyphs for its listbox row. */
function iconSetSamples(setName: string): string[] {
  const set = (themeIcons as Record<string, Record<string, string>>)[setName] || {}
  return ['search', 'check', 'warning', 'light', 'dark', 'star', 'folder', 'upload'].map(key => set[key]).filter((name): name is string => !!name)
}

/* ------------------------------------------------------------- defaults -- */

// MD is the stock default — one deduped entry storing 'default'
const defaultSizeItems = [
  { label: 'XS', value: 'xs' },
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'default', defaultTag: true },
  { label: 'LG', value: 'lg' },
  { label: 'XL', value: 'xl' }
]

// Per-group default variants, each offering only what its components support;
// the app-wide `variant` shows through as the fallback.
const variantItems = (values: string[]) => values.map(value => ({ label: capitalize(value), value }))

/** Variant names UButton can render itself — the rest (none) fall back. */
const RENDERABLE_VARIANTS = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link']

/** Variant grid popovers close on pick — one open flag per group. */
const variantGridOpen = reactive<Record<string, boolean>>({ buttons: false, panels: false, inputs: false })

// `stock` is the library's own default variant — its cell wears the
// "(Default)" tag and picking it clears the override instead of pinning.
const variantGroupFields = [
  { key: 'buttons' as const, label: 'Button Defaults', hasColor: true, stock: 'solid', items: variantItems(['solid', 'outline', 'soft', 'subtle', 'ghost', 'link']) },
  { key: 'panels' as const, label: 'Card Defaults', hasColor: false, stock: 'outline', items: variantItems(['solid', 'outline', 'soft', 'subtle']) },
  { key: 'inputs' as const, label: 'Input Defaults', hasColor: true, stock: 'outline', items: variantItems(['outline', 'soft', 'subtle', 'ghost', 'none']) }
]

function groupVariantModel(group: VariantGroup) {
  const supported = variantGroupFields.find(field => field.key === group)!.items.map(item => item.value)
  return computed({
    get: () => {
      const own = style.value.defaults?.variants?.[group]
      if (own && own !== 'default') return own
      // An app-wide value this group can't express (e.g. solid inputs)
      // truthfully reads as Default — the engine skips it there too.
      const appWide = style.value.defaults?.variant
      return appWide && supported.includes(appWide) ? appWide : 'default'
    },
    set: (value: any) => {
      const defaults = style.value.defaults || {}

      // Picking Default under an app-wide variant must actually win: the
      // engine skips 'default' entries, so the app-wide value explodes
      // into the OTHER groups (where they support it) and disappears.
      if (value === 'default' && defaults.variant) {
        const variants: Record<string, any> = {}
        for (const field of variantGroupFields) {
          if (field.key === group) continue
          const existing = defaults.variants?.[field.key]
          if (existing && existing !== 'default') {
            variants[field.key] = existing
          } else if (field.items.some(item => item.value === defaults.variant)) {
            variants[field.key] = defaults.variant
          }
        }
        const next = { ...defaults, variants }
        delete next.variant
        setStyle({ defaults: next })
        return
      }

      setStyle({ defaults: { ...defaults, variants: { ...defaults.variants, [group]: value } } })
    }
  })
}

const groupVariants = Object.fromEntries(variantGroupFields.map(field => [field.key, groupVariantModel(field.key)])) as Record<VariantGroup, ReturnType<typeof groupVariantModel>>

// Primary IS the stock default — one entry, tagged, storing 'default'
// (an explicit 'primary' would export a no-op override).
const defaultColorItems = [
  { label: 'Primary', value: 'default', chip: { color: 'primary' as any }, defaultTag: true },
  ...['secondary', 'success', 'info', 'warning', 'error', 'neutral'].map(value => ({
    label: capitalize(value),
    value,
    chip: { color: value as any }
  }))
]

function groupColorModel(group: VariantGroup) {
  return computed({
    get: () => style.value.defaults?.colors?.[group] || 'default',
    set: (value: any) => setStyle({ defaults: { ...style.value.defaults, colors: { ...style.value.defaults?.colors, [group]: value } } })
  })
}

const groupColors = Object.fromEntries(variantGroupFields.map(field => [field.key, groupColorModel(field.key)])) as Record<VariantGroup, ReturnType<typeof groupColorModel>>

const defaultSize = computed({
  // legacy saved prefs may still pin 'md' explicitly — it IS the default
  get: () => {
    const size = style.value.defaults?.size || 'default'
    return size === 'md' ? 'default' : size
  },
  set: (value: any) => setStyle({ defaults: { ...style.value.defaults, size: value } })
})
</script>

<template>
  <!-- Sections own their padding so the separators run edge to edge. -->
  <div class="flex flex-col">
    <ThemeStudioSection
      label="Font"
      help-to="/docs/getting-started/integrations/fonts"
      class="p-4"
      section-key="font"
    >
      <div class="flex flex-col gap-2">
        <!-- live specimen: the heading treatment over the base body -->
        <div class="rounded-md ring ring-default bg-elevated/50 px-3 py-2 select-none">
          <p class="text-sm text-highlighted truncate" :style="headingSampleStyle">
            Grumpy wizards make toxic brew
          </p>
          <p class="text-xs text-muted truncate" :style="bodySampleStyle">
            The quick brown fox jumps over the lazy dog 0123456789
          </p>
        </div>

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
              :aria-label="`${row.label} font`"
              class="flex-1 min-w-0"
            />

            <UFieldGroup size="sm">
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
                    <ThemeStudioSliderRow
                      v-for="weight in row.weights"
                      :key="weight.label"
                      v-model="weight.model.value"
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
                  <ThemeStudioSliderRow
                    v-model="row.letterSpacing.value"
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
                  <ThemeStudioSliderRow
                    v-model="row.lineHeight.value"
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
      </div>
    </ThemeStudioSection>

    <USeparator />

    <ThemeStudioSection
      label="Icons"
      help-to="/docs/getting-started/integrations/icons"
      class="p-4"
      section-key="icons"
    >
      <div class="flex flex-col gap-2">
        <!-- a spread of the selected set -->
        <div class="rounded-md ring ring-default bg-elevated/50 px-3 py-2 flex flex-wrap justify-center gap-2.5">
          <UIcon v-for="name in iconPreviews" :key="name" :name="name" class="size-4 text-muted" />
        </div>

        <!-- every set previews a strip of its own glyphs -->
        <ThemeStudioListPicker
          v-model="icon"
          :items="icons"
          :icon="icons.find(i => i.value === icon)?.icon"
          aria-label="Icon set"
        >
          <template #item-description="{ item }">
            <span class="flex items-center gap-1.5 pt-0.5">
              <UIcon
                v-for="name in iconSetSamples(item.value)"
                :key="name"
                :name="name"
                class="size-3.5 text-muted"
              />
            </span>
          </template>
        </ThemeStudioListPicker>
      </div>
    </ThemeStudioSection>

    <USeparator />

    <ThemeStudioSection label="Scale" class="p-4" section-key="scale">
      <div class="flex flex-col gap-2">
        <ThemeStudioSliderRow
          v-model="radius"
          label="Radius"
          :min="0"
          :max="0.5"
          :step="0.125"
        />

        <ThemeStudioSliderRow
          v-model="fontSize"
          label="Text"
          :min="14"
          :max="18"
          :step="0.5"
          unit="px"
        />

        <ThemeStudioSliderRow v-model="spacing" label="Spacing" :min="0.15" :max="0.35" :step="0.025" />

        <div class="flex items-center gap-2">
          <span class="text-xs text-muted w-13 shrink-0 select-none">Size</span>

          <ThemeStudioDefaultSelect
            v-model="defaultSize"
            :items="defaultSizeItems"
            icon="i-lucide-proportions"
            class="flex-1"
            aria-label="Default size"
          />
        </div>
      </div>
    </ThemeStudioSection>

    <USeparator />

    <template v-for="field in variantGroupFields" :key="field.key">
      <ThemeStudioSection
        :label="field.label"
        :default-open="false"
        class="p-4"
        :section-key="field.key"
      >
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <span class="text-xs text-muted w-13 shrink-0 select-none">Variant</span>

            <UPopover v-model:open="variantGridOpen[field.key]" :content="{ side: 'bottom', align: 'start' }" class="flex-1">
              <UButton
                size="sm"
                color="neutral"
                variant="subtle"
                block
                icon="i-lucide-layers"
                trailing-icon="i-lucide-chevron-down"
                :ui="{ label: 'flex-1 text-left' }"
                :aria-label="`${field.label} variant`"
              >
                {{ field.items.find(item => item.value === (groupVariants[field.key].value === 'default' ? field.stock : groupVariants[field.key].value))?.label }}<span v-if="groupVariants[field.key].value === 'default'" class="text-dimmed font-normal">&nbsp;(Default)</span>
              </UButton>

              <template #content>
                <!-- each cell renders IN the variant it picks -->
                <div class="w-64 p-2 grid grid-cols-2 gap-1">
                  <UButton
                    v-for="item in field.items"
                    :key="item.value"
                    size="sm"
                    block
                    :color="(groupVariants[field.key].value === item.value || (groupVariants[field.key].value === 'default' && item.value === field.stock)) ? 'primary' : 'neutral'"
                    :variant="RENDERABLE_VARIANTS.includes(item.value) ? (item.value as any) : 'subtle'"
                    :class="[item.value === 'none' && 'opacity-60', 'min-w-0']"
                    @click="groupVariants[field.key].value = (item.value === field.stock ? 'default' : item.value); variantGridOpen[field.key] = false"
                  >
                    <!-- opacity, not a color: text-dimmed would fight the variant's own text color -->
                    <span class="truncate">{{ item.label }}<span v-if="item.value === field.stock" class="opacity-70 font-normal">&nbsp;(Default)</span></span>
                  </UButton>
                </div>
              </template>
            </UPopover>
          </div>

          <div v-if="field.hasColor" class="flex items-center gap-2">
            <span class="text-xs text-muted w-13 shrink-0 select-none">Color</span>

            <ThemeStudioDefaultSelect
              v-model="groupColors[field.key].value"
              :items="defaultColorItems"
              class="flex-1"
              :aria-label="`${field.label} color`"
            >
              <template #leading>
                <UChip
                  :color="(groupColors[field.key].value === 'default' ? 'primary' : groupColors[field.key].value) as any"
                  inset
                  standalone
                />
              </template>
            </ThemeStudioDefaultSelect>
          </div>
        </div>
      </ThemeStudioSection>

      <USeparator v-if="field.key !== 'inputs'" />
    </template>
  </div>
</template>
