<script setup lang="ts">
import { TOKEN_SHADE_TARGETS, TOKEN_GROUPS, SHADES, SHADOW_SHADE_DEFAULTS, BORDER_SHADE_DEFAULTS, BORDER_WIDTH_DEFAULT, SHADOW_GEOMETRY_DEFAULTS, resolveAlias, resolveShade } from '../../utils/theme-engine'
import type { VariantGroup, TokenRamp, ColorAlias, ThemeDoc } from '../../utils/theme-engine'

const appConfig = useAppConfig()

const {
  neutralColors,
  neutral,
  primaryColors,
  primary,
  blackAsPrimary,
  setBlackAsPrimary,
  radius,
  fontSize,
  spacing,
  fonts,
  font,
  icon,
  icons,
  modes,
  mode
} = useTheme()

const { selectPalette, isCustomPalette, style, setStyle, presets, activePreset, applyPreset, shuffle } = useThemeStudio()

/** The preset's primary + neutral at 500, straight from its own document. */
function presetSwatches(doc: ThemeDoc): string[] {
  const primary = doc.blackAsPrimary ? 'black' : resolveShade(doc, resolveAlias(doc, 'primary'), 500)
  const neutral = resolveShade(doc, resolveAlias(doc, 'neutral'), 500)
  return [primary, neutral].filter((color): color is string => !!color)
}

const presetItems = computed(() => presets.map(preset => ({
  label: preset.name,
  icon: preset.icon,
  type: 'checkbox' as const,
  checked: activePreset.value === preset.id,
  swatches: presetSwatches(preset.doc),
  onSelect: () => applyPreset(preset)
})))

const presetLabel = computed(() => presets.find(preset => preset.id === activePreset.value)?.name || 'Presets')

const openSections = reactive<Record<string, boolean>>({
  primary: true,
  neutral: true,
  semantic: true,
  radius: true,
  sizing: true,
  defaults: true,
  shadows: true,
  borders: true,
  font: true,
  icons: true,
  mode: true,
  // token groups keyed by group name; only the first starts open
  ...Object.fromEntries(TOKEN_GROUPS.map((group, index) => [`tokens-${group.key}`, index === 0]))
})

// Every ramp is a suggestion for either role, sectioned so the list stays
// scannable: colorful ramps lead the primary/semantic pickers, neutrals
// lead the background picker.
const colorSections = [
  { label: 'Colors', colors: primaryColors },
  { label: 'Neutrals', colors: neutralColors }
]
const backgroundSections = [
  { label: 'Neutrals', colors: neutralColors },
  { label: 'Colors', colors: primaryColors }
]

const semanticAliases: ColorAlias[] = ['secondary', 'success', 'info', 'warning', 'error']

const aliasValues = computed(() => appConfig.ui.colors as Record<string, string>)

/** Palette name → the css var chip name (tailwind's neutral gray is remapped in docs). */
function paletteChip(name: string) {
  return name === 'neutral' ? 'old-neutral' : name
}

const primarySwatch = computed(() => {
  if (blackAsPrimary.value) {
    return { label: 'Black', color: undefined }
  }
  if (isCustomPalette('primary')) {
    return { label: 'Custom', color: 'var(--color-custom-primary-500)' }
  }
  return { label: primary.value, color: `var(--color-${primary.value}-500)` }
})

const neutralSwatch = computed(() => {
  if (isCustomPalette('neutral')) {
    return { label: 'Custom', color: 'var(--color-custom-neutral-500)' }
  }
  const chip = neutral.value === 'neutral' ? 'old-neutral' : neutral.value
  return { label: neutral.value, color: `var(--color-${chip}-500)` }
})

const shadowOptions = [
  { label: 'None', value: 'none' },
  { label: 'Default', value: 'soft' },
  { label: 'Custom', value: 'hard' }
] as const

const shadowOpacity = computed({
  get: () => style.value.shadowOpacity ?? (style.value.shadow === 'hard' ? 100 : 25),
  set: (value: number) => setStyle({ shadowOpacity: value })
})

const borderOptions = [
  { label: 'None', value: 'none' },
  { label: 'Default', value: 'default' },
  { label: 'Custom', value: 'custom' }
] as const

// Legacy saved prefs may still hold bold/frame — both read as custom.
const borderStyle = computed(() => {
  const value = style.value.border || 'default'
  return value === 'bold' || value === 'frame' ? 'custom' : value
})

const borderWidth = computed({
  get: () => style.value.borderWidth ?? BORDER_WIDTH_DEFAULT,
  set: (value: number) => setStyle({ borderWidth: value })
})

// Outline solid/soft surfaces too — the neobrutalist frame look.
const frameSolids = computed({
  get: () => !!style.value.frame || style.value.border === 'frame',
  set: (value: boolean) => setStyle({ frame: value })
})

const borderColorItems = [
  { label: 'Default', value: 'default' },
  { label: 'Inverted', value: 'inverted' },
  { label: 'Black', value: 'black' },
  { label: 'White', value: 'white' },
  { label: 'Primary', value: 'primary' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Custom…', value: 'shade' },
  { label: 'Primary shade…', value: 'primary-shade' }
]

const shadowColorItems = [
  { label: 'Default (ink)', value: 'default' },
  { label: 'Black', value: 'black' },
  { label: 'Inverted', value: 'inverted' },
  { label: 'Primary', value: 'primary' },
  { label: 'Custom…', value: 'shade' },
  { label: 'Primary shade…', value: 'primary-shade' }
]

// Slider position ↔ SHADES index, per mode. shadow/border shades write both
// modes on first touch (explicit 'shade' mode choice); token shades write
// ONLY the touched mode so an untouched mode never becomes an override.
function shadeSlider(field: 'shadowShade' | 'borderShade', defaults: { light: number, dark: number }, target: 'light' | 'dark') {
  return computed({
    get: () => SHADES.indexOf((style.value[field] || defaults)[target] as typeof SHADES[number]),
    set: (index: number) => {
      const current = { ...defaults, ...style.value[field] }
      setStyle({ [field]: { ...current, [target]: SHADES[index]! } })
    }
  })
}

const shadowShades = {
  light: shadeSlider('shadowShade', SHADOW_SHADE_DEFAULTS, 'light'),
  dark: shadeSlider('shadowShade', SHADOW_SHADE_DEFAULTS, 'dark')
}

const borderShades = {
  light: shadeSlider('borderShade', BORDER_SHADE_DEFAULTS, 'light'),
  dark: shadeSlider('borderShade', BORDER_SHADE_DEFAULTS, 'dark')
}

// Per-semantic-token shade sliders (Background, Inverted, Highlighted…).
function tokenShadeSlider(token: string, defaults: { light: number, dark: number }, target: 'light' | 'dark') {
  return computed({
    get: () => {
      const value = style.value.tokenShades?.[token]?.[target] ?? defaults[target]
      return SHADES.indexOf(value as typeof SHADES[number])
    },
    set: (index: number) => {
      setStyle({
        tokenShades: {
          ...style.value.tokenShades,
          [token]: { ...style.value.tokenShades?.[token], [target]: SHADES[index]! }
        }
      })
    }
  })
}

const tokenSections = TOKEN_SHADE_TARGETS.map(target => ({
  ...target,
  sliders: {
    light: tokenShadeSlider(target.token, target.defaults, 'light'),
    dark: tokenShadeSlider(target.token, target.defaults, 'dark')
  }
}))

const tokenGroups = TOKEN_GROUPS.map(group => ({
  ...group,
  sections: tokenSections.filter(section => section.group === group.key)
}))

const neutralChip = computed(() => neutral.value === 'neutral' ? 'old-neutral' : neutral.value)
const primaryChip = computed(() => isCustomPalette('primary') ? 'custom-primary' : primary.value)

/** Palette name coloring a token slider's swatch — the alias's current ramp. */
function rampChip(ramp: TokenRamp): string {
  if (ramp === 'primary') return primaryChip.value
  if (ramp === 'neutral') return neutralChip.value
  const name = (appConfig.ui.colors as Record<string, string>)[ramp] || ramp
  return name === 'neutral' ? 'old-neutral' : name
}

// No 'system' tab: the studio is about previewing a concrete mode. For
// system-pref visitors the model can read 'system' before color-mode
// resolves it — fall back to the scheme class the color-mode script has
// already stamped on <html>, so a tab is always highlighted.
const modeTabs = computed(() => modes.value.filter(m => m.label !== 'system').map(m => ({ label: m.label, icon: m.icon, value: m.label })))

// Resolved AFTER mount on purpose: the server can't know a system-pref
// visitor's scheme, and hydration adopts SSR attributes without patching —
// a post-mount write is a real update, so the highlight always lands.
const modeTab = ref<string | undefined>()

onMounted(() => {
  modeTab.value = mode.value === 'light' || mode.value === 'dark'
    ? mode.value
    : document.documentElement.classList.contains('dark') ? 'dark' : 'light'
})

watch(modeTab, (value) => {
  if (value && value !== mode.value) mode.value = value
})

watch(mode, (value) => {
  if (value === 'light' || value === 'dark') modeTab.value = value
})

// One curve editor per alias, toggled by the edit icon next to each select.
const paletteEditors = reactive<Record<string, boolean>>({})

/** Display name for an alias's palette — custom ramps read as 'Custom'. */
function aliasLabel(alias: ColorAlias) {
  return isCustomPalette(alias) ? 'Custom' : aliasValues.value[alias]
}

const openGroups = ref('colors')

const groupItems = [
  { label: 'Colors', value: 'colors', slot: 'colors' as const },
  { label: 'Style', value: 'style', slot: 'style' as const },
  { label: 'Tokens', value: 'tokens', slot: 'tokens' as const },
  { label: 'General', value: 'general', slot: 'general' as const }
]

const defaultSizeItems = [
  { label: 'Default', value: 'default' },
  { label: 'XS', value: 'xs' },
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'md' },
  { label: 'LG', value: 'lg' },
  { label: 'XL', value: 'xl' }
]

// Per-group default variants, each offering only what its components
// actually support (buttons add ghost, form fields run outline → none);
// the app-wide `variant` (presets, shuffle) shows through as the fallback
// until a group makes its own choice.
const variantItems = (values: string[]) => ['default', ...values].map(value => ({ label: value.charAt(0).toUpperCase() + value.slice(1), value }))

const variantGroupFields = [
  { key: 'buttons' as const, label: 'Buttons', items: variantItems(['solid', 'outline', 'soft', 'subtle', 'ghost', 'link']) },
  { key: 'panels' as const, label: 'Cards', items: variantItems(['solid', 'outline', 'soft', 'subtle']) },
  { key: 'inputs' as const, label: 'Inputs', items: variantItems(['outline', 'soft', 'subtle', 'ghost', 'none']) }
]

function groupVariantModel(group: VariantGroup) {
  const supported = variantGroupFields.find(field => field.key === group)!.items.map(item => item.value)
  return computed({
    get: () => {
      const own = style.value.defaults?.variants?.[group]
      if (own) return own
      // An app-wide value this group can't express (e.g. solid inputs)
      // truthfully reads as Default — the engine skips it there too.
      const appWide = style.value.defaults?.variant
      return appWide && supported.includes(appWide) ? appWide : 'default'
    },
    set: (value: any) => setStyle({ defaults: { ...style.value.defaults, variants: { ...style.value.defaults?.variants, [group]: value } } })
  })
}

const groupVariants = Object.fromEntries(variantGroupFields.map(field => [field.key, groupVariantModel(field.key)])) as Record<VariantGroup, ReturnType<typeof groupVariantModel>>

const defaultSize = computed({
  get: () => style.value.defaults?.size || 'default',
  set: (value: any) => setStyle({ defaults: { ...style.value.defaults, size: value } })
})

// Hard-shadow geometry sliders (px)
const geometryFields = [
  { key: 'x', label: 'Offset X', min: -12, max: 12 },
  { key: 'y', label: 'Offset Y', min: -12, max: 12 },
  { key: 'blur', label: 'Blur', min: 0, max: 24 },
  { key: 'spread', label: 'Spread', min: 0, max: 8 }
] as const

function geometrySlider(key: 'x' | 'y' | 'blur' | 'spread') {
  return computed({
    get: () => ({ ...SHADOW_GEOMETRY_DEFAULTS, ...style.value.shadowGeometry })[key],
    set: (value: number) => setStyle({ shadowGeometry: { ...SHADOW_GEOMETRY_DEFAULTS, ...style.value.shadowGeometry, [key]: value } })
  })
}

const geometry = Object.fromEntries(geometryFields.map(field => [field.key, geometrySlider(field.key)])) as Record<'x' | 'y' | 'blur' | 'spread', ReturnType<typeof geometrySlider>>

const borderColor = computed({
  get: () => style.value.borderColor || 'default',
  set: (value: any) => setStyle({ borderColor: value })
})

const shadowColor = computed({
  get: () => style.value.shadowColor || 'default',
  set: (value: any) => setStyle({ shadowColor: value })
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      class="flex gap-2 p-4 pb-0"
    >
      <UDropdownMenu
        :items="presetItems"
        :content="{ align: 'start' }"
        class="flex-1 min-w-0"
        :ui="{ itemTrailing: 'self-center', content: 'w-(--reka-dropdown-menu-trigger-width)' }"
      >
        <UButton
          :label="presetLabel"
          icon="i-lucide-swatch-book"
          trailing-icon="i-lucide-chevron-down"
          color="neutral"
          variant="subtle"
          block
        />

        <template #item-trailing="{ item }">
          <span class="inline-flex items-center gap-1 h-full">
            <span
              v-for="(swatch, index) in item.swatches"
              :key="index"
              class="size-2 rounded-full ring ring-default"
              :style="{ backgroundColor: swatch }"
            />
          </span>
        </template>
      </UDropdownMenu>

      <UTooltip text="Random theme">
        <UButton
          icon="i-lucide-dices"
          color="neutral"
          variant="subtle"
          aria-label="Random theme"
          @click="shuffle"
        />
      </UTooltip>
    </div>
    <UTabs
      v-model="modeTab"
      :items="modeTabs"
      :content="false"
      size="sm"
      color="primary"
      class="w-full px-4 "
      :ui="{ trigger: ' capitalize' }"
    />

    <UAccordion
      v-model="openGroups"
      :ui="{ content: 'px-4', header: 'px-6' }"
      :items="groupItems"
      :unmount-on-hide="false"
      class="border-y border-default"
    >
      <template #colors>
        <div class="flex flex-col gap-2.5 pt-1 pb-4">
          <fieldset class="rounded-md ring-[length:var(--studio-border-width,1px)] ring-default bg-default p-2.5">
            <legend class="bg-default text-xs leading-none font-semibold select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Primary"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"

                :ui="{ leadingIcon: ['transition-transform duration-200', !openSections.primary && '-rotate-90'] }"
                @click="openSections.primary = !openSections.primary"
              />

              <UButton
                to="/docs/getting-started/theme/css-variables#colors"
                size="xs"
                color="neutral"
                variant="ghost"
                icon="i-lucide-help-circle"
              />
            </legend>

            <div v-show="openSections.primary">
              <UFieldGroup size="sm" class="flex w-full">
                <UPopover :content="{ side: 'bottom', align: 'start' }" class="flex-1 min-w-0">
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
                        :class="{ 'bg-black dark:bg-white': blackAsPrimary }"
                        :style="primarySwatch.color ? { backgroundColor: primarySwatch.color } : undefined"
                      />
                    </template>

                    {{ primarySwatch.label }}
                  </UButton>

                  <template #content>
                    <div class="flex flex-col gap-2 w-72 p-2">
                      <div v-for="(section, index) in colorSections" :key="section.label">
                        <p class="text-[11px] font-semibold text-muted px-1 mb-1 select-none">
                          {{ section.label }}
                        </p>

                        <div class="grid grid-cols-3 gap-1">
                          <ThemePickerButton
                            v-if="index === 0"
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
                            :selected="!blackAsPrimary && primary === color"
                            @click="selectPalette('primary', color)"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </UPopover>

                <UButton
                  :icon="isCustomPalette('primary') ? 'i-lucide-paintbrush' : 'i-lucide-pencil'"
                  color="neutral"
                  variant="subtle"
                  :active="paletteEditors.primary || isCustomPalette('primary')"
                  active-color="primary"
                  active-variant="subtle"
                  aria-label="Edit primary palette"
                  @click="paletteEditors.primary = !paletteEditors.primary"
                />
              </UFieldGroup>

              <ThemeStudioPaletteEditor v-model:open="paletteEditors.primary" alias="primary" />
            </div>
          </fieldset>

          <fieldset class="rounded-md ring-[length:var(--studio-border-width,1px)] ring-default bg-default p-2.5">
            <legend class="bg-default text-xs leading-none font-semibold select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Background"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                :ui="{ leadingIcon: ['transition-transform duration-200', !openSections.neutral && '-rotate-90'] }"
                @click="openSections.neutral = !openSections.neutral"
              />

              <UButton
                to="/docs/getting-started/theme/css-variables#text"
                size="xs"
                color="neutral"
                variant="ghost"
                icon="i-lucide-help-circle"
              />
            </legend>

            <div v-show="openSections.neutral">
              <UFieldGroup size="sm" class="flex w-full">
                <UPopover :content="{ side: 'bottom', align: 'start' }" class="flex-1 min-w-0">
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
                        :style="{ backgroundColor: neutralSwatch.color }"
                      />
                    </template>

                    {{ neutralSwatch.label }}
                  </UButton>

                  <template #content>
                    <div class="flex flex-col gap-2 w-72 p-2">
                      <div v-for="section in backgroundSections" :key="section.label">
                        <p class="text-[11px] font-semibold text-muted px-1 mb-1 select-none">
                          {{ section.label }}
                        </p>

                        <div class="grid grid-cols-3 gap-1">
                          <ThemePickerButton
                            v-for="color in section.colors"
                            :key="color"
                            :label="color"
                            :chip="paletteChip(color)"
                            :selected="neutral === color"
                            @click="selectPalette('neutral', color)"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </UPopover>

                <UButton
                  :icon="isCustomPalette('neutral') ? 'i-lucide-paintbrush' : 'i-lucide-pencil'"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  :active="paletteEditors.neutral || isCustomPalette('neutral')"
                  active-color="primary"
                  active-variant="subtle"
                  aria-label="Edit background palette"
                  @click="paletteEditors.neutral = !paletteEditors.neutral"
                />
              </UFieldGroup>

              <ThemeStudioPaletteEditor v-model:open="paletteEditors.neutral" alias="neutral" />
            </div>
          </fieldset>

          <fieldset class="rounded-md ring-[length:var(--studio-border-width,1px)] ring-default bg-default p-2.5">
            <legend class="bg-default text-xs leading-none font-semibold select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Semantic"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                :ui="{ leadingIcon: ['transition-transform duration-200', !openSections.semantic && '-rotate-90'] }"
                @click="openSections.semantic = !openSections.semantic"
              />

              <UButton
                to="/docs/getting-started/theme/design-system"
                size="xs"
                color="neutral"
                variant="ghost"
                icon="i-lucide-help-circle"
              />
            </legend>

            <div v-show="openSections.semantic" class="flex flex-col gap-1.5">
              <div v-for="alias in semanticAliases" :key="alias">
                <div class="flex items-center gap-2">
                  <span class="text-[11px] text-muted w-13 shrink-0 capitalize select-none">{{ alias }}</span>

                  <UFieldGroup size="sm" class="flex flex-1 min-w-0">
                    <UPopover :content="{ side: 'bottom', align: 'start' }" class="flex-1 min-w-0">
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
                            :style="{ backgroundColor: `var(--color-${paletteChip(aliasValues[alias] || alias)}-500)` }"
                          />
                        </template>

                        {{ aliasLabel(alias) }}
                      </UButton>

                      <template #content>
                        <div class="flex flex-col gap-2 w-72 p-2">
                          <div v-for="section in colorSections" :key="section.label">
                            <p class="text-[11px] font-semibold text-muted px-1 mb-1 select-none">
                              {{ section.label }}
                            </p>

                            <div class="grid grid-cols-3 gap-1">
                              <ThemePickerButton
                                v-for="color in section.colors"
                                :key="color"
                                :label="color"
                                :chip="paletteChip(color)"
                                :selected="aliasValues[alias] === color"
                                @click="selectPalette(alias, color)"
                              />
                            </div>
                          </div>
                        </div>
                      </template>
                    </UPopover>

                    <UButton
                      :icon="isCustomPalette(alias) ? 'i-lucide-paintbrush' : 'i-lucide-pencil'"
                      color="neutral"
                      variant="subtle"
                      size="sm"
                      :active="paletteEditors[alias] || isCustomPalette(alias)"
                      active-color="primary"
                      active-variant="subtle"
                      :aria-label="`Edit ${alias} palette`"
                      @click="paletteEditors[alias] = !paletteEditors[alias]"
                    />
                  </UFieldGroup>
                </div>

                <ThemeStudioPaletteEditor v-model:open="paletteEditors[alias]" :alias="alias" />
              </div>
            </div>
          </fieldset>
        </div>
      </template>

      <template #style>
        <div class="flex flex-col gap-2.5 pt-1 pb-4">
          <fieldset class="rounded-md ring-[length:var(--studio-border-width,1px)] ring-default bg-default p-2.5">
            <legend class="bg-default text-xs leading-none font-semibold select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Radius"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                :ui="{ leadingIcon: ['transition-transform duration-200', !openSections.radius && '-rotate-90'] }"
                @click="openSections.radius = !openSections.radius"
              />

              <UButton
                to="/docs/getting-started/theme/css-variables#radius"
                size="xs"
                color="neutral"
                variant="ghost"
                icon="i-lucide-help-circle"
              />
            </legend>

            <div v-show="openSections.radius" class="flex items-center gap-3">
              <USlider
                v-model="radius"
                :min="0"
                :max="0.5"
                :step="0.125"
                size="sm"
              />

              <span class="text-[11px] font-mono text-muted tabular-nums shrink-0 w-14 text-right">{{ radius }}rem</span>
            </div>
          </fieldset>

          <fieldset class="rounded-md ring-[length:var(--studio-border-width,1px)] ring-default bg-default p-2.5">
            <legend class="bg-default text-xs leading-none font-semibold select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Sizing"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                :ui="{ leadingIcon: ['transition-transform duration-200', !openSections.sizing && '-rotate-90'] }"
                @click="openSections.sizing = !openSections.sizing"
              />
            </legend>

            <div v-show="openSections.sizing" class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="text-[11px] text-muted w-13 shrink-0 select-none">Text</span>

                <USlider v-model="fontSize" :min="14" :max="18" :step="0.5" size="xs" />

                <span class="text-[11px] text-dimmed font-mono w-10 text-right shrink-0">{{ fontSize }}px</span>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-[11px] text-muted w-13 shrink-0 select-none">Spacing</span>

                <USlider v-model="spacing" :min="0.15" :max="0.35" :step="0.025" size="xs" />

                <span class="text-[11px] text-dimmed font-mono w-10 text-right shrink-0">{{ spacing }}</span>
              </div>
            </div>
          </fieldset>

          <fieldset class="rounded-md ring-[length:var(--studio-border-width,1px)] ring-default bg-default p-2.5">
            <legend class="bg-default text-xs leading-none font-semibold select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Defaults"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                :ui="{ leadingIcon: ['transition-transform duration-200', !openSections.defaults && '-rotate-90'] }"
                @click="openSections.defaults = !openSections.defaults"
              />
            </legend>

            <div v-show="openSections.defaults" class="flex flex-col gap-1.5">
              <div v-for="field in variantGroupFields" :key="field.key" class="flex items-center gap-2">
                <span class="text-[11px] text-muted w-13 shrink-0 select-none">{{ field.label }}</span>

                <USelect
                  v-model="groupVariants[field.key].value"
                  size="sm"
                  color="neutral"
                  icon="i-lucide-layers"
                  :items="field.items"
                  class="flex-1"
                />
              </div>

              <div class="flex items-center gap-2">
                <span class="text-[11px] text-muted w-13 shrink-0 select-none">Size</span>

                <USelect
                  v-model="defaultSize"
                  size="sm"
                  color="neutral"
                  icon="i-lucide-proportions"
                  :items="defaultSizeItems"
                  class="flex-1"
                />
              </div>
            </div>
          </fieldset>

          <fieldset class="rounded-md ring-[length:var(--studio-border-width,1px)] ring-default bg-default p-2.5">
            <legend class="bg-default text-xs leading-none font-semibold select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Shadows"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                :ui="{ leadingIcon: ['transition-transform duration-200', !openSections.shadows && '-rotate-90'] }"
                @click="openSections.shadows = !openSections.shadows"
              />
            </legend>

            <div v-show="openSections.shadows">
              <div class="grid grid-cols-3 gap-1">
                <ThemePickerButton
                  v-for="option in shadowOptions"
                  :key="option.value"
                  :label="option.label"
                  :selected="(style.shadow || 'none') === option.value"
                  @click="setStyle({ shadow: option.value })"
                />
              </div>

              <div v-if="(style.shadow || 'none') !== 'none'" class="mt-1.5 flex flex-col gap-2">
                <USelect
                  v-model="shadowColor"
                  size="sm"
                  color="neutral"
                  icon="i-lucide-paint-bucket"
                  :items="shadowColorItems"
                  class="w-full"
                />

                <template v-if="shadowColor === 'shade' || shadowColor === 'primary-shade'">
                  <ThemeStudioShadeSlider
                    v-for="(slider, modeName) in shadowShades"
                    :key="modeName"
                    v-model="slider.value"
                    :mode="modeName"
                    :chip="shadowColor === 'primary-shade' ? primaryChip : neutralChip"
                  />
                </template>

                <div class="flex items-center gap-2">
                  <span class="text-[11px] text-muted w-13 shrink-0 select-none">Opacity</span>

                  <USlider v-model="shadowOpacity" :min="5" :max="100" :step="5" size="xs" />

                  <span class="text-[11px] text-dimmed font-mono w-8 text-right shrink-0">{{ shadowOpacity }}%</span>
                </div>

                <template v-if="(style.shadow || 'none') === 'hard'">
                  <div v-for="field in geometryFields" :key="field.key" class="flex items-center gap-2">
                    <span class="text-[11px] text-muted w-13 shrink-0 select-none">{{ field.label }}</span>

                    <USlider v-model="geometry[field.key].value" :min="field.min" :max="field.max" :step="1" size="xs" />

                    <span class="text-[11px] text-dimmed font-mono w-8 text-right shrink-0">{{ geometry[field.key].value }}px</span>
                  </div>
                </template>
              </div>
            </div>
          </fieldset>

          <fieldset class="rounded-md ring-[length:var(--studio-border-width,1px)] ring-default bg-default p-2.5">
            <legend class="bg-default text-xs leading-none font-semibold select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Borders"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                :ui="{ leadingIcon: ['transition-transform duration-200', !openSections.borders && '-rotate-90'] }"
                @click="openSections.borders = !openSections.borders"
              />
            </legend>

            <div v-show="openSections.borders">
              <div class="grid grid-cols-3 gap-1">
                <ThemePickerButton
                  v-for="option in borderOptions"
                  :key="option.value"
                  :label="option.label"
                  :selected="borderStyle === option.value"
                  @click="setStyle({ border: option.value })"
                />
              </div>

              <div v-if="borderStyle === 'custom'" class="mt-1.5 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-[11px] text-muted w-13 shrink-0 select-none">Width</span>

                  <USlider v-model="borderWidth" :min="1" :max="4" :step="1" size="xs" />

                  <span class="text-[11px] text-dimmed font-mono w-8 text-right shrink-0">{{ borderWidth }}px</span>
                </div>

                <div class="flex items-center gap-2">
                  <span class="text-[11px] text-muted w-13 shrink-0 select-none">Frame</span>

                  <UTooltip text="Outline solid surfaces too — the neobrutalist look">
                    <USwitch v-model="frameSolids" size="sm" aria-label="Frame solid surfaces" />
                  </UTooltip>
                </div>

                <USelect
                  v-model="borderColor"
                  size="sm"
                  color="neutral"
                  icon="i-lucide-paint-bucket"
                  :items="borderColorItems"
                  class="w-full"
                />

                <template v-if="borderColor === 'shade' || borderColor === 'primary-shade'">
                  <ThemeStudioShadeSlider
                    v-for="(slider, modeName) in borderShades"
                    :key="modeName"
                    v-model="slider.value"
                    :mode="modeName"
                    :chip="borderColor === 'primary-shade' ? primaryChip : neutralChip"
                  />
                </template>
              </div>
            </div>
          </fieldset>
        </div>
      </template>

      <template #tokens>
        <div class="flex flex-col gap-2.5 pt-1 pb-4">
          <fieldset v-for="group in tokenGroups" :key="group.key" class="rounded-md ring-[length:var(--studio-border-width,1px)] ring-default bg-default p-2.5">
            <legend class="bg-default text-xs leading-none font-semibold select-none flex items-center gap-1 cursor-pointer">
              <UButton
                :label="group.label"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                :ui="{ leadingIcon: ['transition-transform duration-200', !openSections[`tokens-${group.key}`] && '-rotate-90'] }"
                @click="openSections[`tokens-${group.key}`] = !openSections[`tokens-${group.key}`]"
              />
            </legend>

            <div v-show="openSections[`tokens-${group.key}`]" class="flex flex-col gap-3">
              <div v-for="section in group.sections" :key="section.token" class="flex flex-col gap-1.5">
                <span class="text-[11px] text-muted select-none">{{ section.label }}</span>

                <ThemeStudioShadeSlider
                  v-for="(slider, modeName) in section.sliders"
                  :key="modeName"
                  v-model="slider.value"
                  :mode="modeName"
                  :chip="rampChip(section.ramp)"
                />
              </div>
            </div>
          </fieldset>
        </div>
      </template>

      <template #general>
        <div class="flex flex-col gap-2.5 pt-1 pb-4">
          <fieldset class="rounded-md ring-[length:var(--studio-border-width,1px)] ring-default bg-default p-2.5">
            <legend class="bg-default text-xs leading-none font-semibold select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Font"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                :ui="{ leadingIcon: ['transition-transform duration-200', !openSections.font && '-rotate-90'] }"
                @click="openSections.font = !openSections.font"
              />

              <UButton
                to="/docs/getting-started/integrations/fonts"
                size="xs"
                color="neutral"
                variant="ghost"
                icon="i-lucide-help-circle"
              />
            </legend>

            <div v-show="openSections.font">
              <USelect
                v-model="font"
                size="sm"
                color="neutral"
                icon="i-lucide-type"
                :items="fonts"
                class="w-full"
              />
            </div>
          </fieldset>

          <fieldset class="rounded-md ring-[length:var(--studio-border-width,1px)] ring-default bg-default p-2.5">
            <legend class="bg-default text-xs leading-none font-semibold select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Icons"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                :ui="{ leadingIcon: ['transition-transform duration-200', !openSections.icons && '-rotate-90'] }"
                @click="openSections.icons = !openSections.icons"
              />

              <UButton
                to="/docs/getting-started/integrations/icons"
                size="xs"
                color="neutral"
                variant="ghost"
                icon="i-lucide-help-circle"
              />
            </legend>

            <div v-show="openSections.icons">
              <USelect
                v-model="icon"
                size="sm"
                color="neutral"
                :icon="icons.find(i => i.value === icon)?.icon"
                :items="icons"
                class="w-full capitalize"
                :ui="{ item: 'capitalize' }"
              />
            </div>
          </fieldset>
        </div>
      </template>
    </UAccordion>
  </div>
</template>
