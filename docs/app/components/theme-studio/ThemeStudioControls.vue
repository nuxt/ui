<script setup lang="ts">
import { TOKEN_SHADE_TARGETS, TOKEN_GROUPS, SHADES, SHADOW_SHADE_DEFAULTS, BORDER_SHADE_DEFAULTS, BORDER_WIDTH_DEFAULT, SHADOW_GEOMETRY_DEFAULTS, INNER_SHADOW_GEOMETRY_DEFAULTS } from '../../utils/theme-engine'
import type { VariantGroup, TokenRamp, ColorAlias } from '../../utils/theme-engine'

const appConfig = useAppConfig()

/** Which settings group this instance renders — one popover per group. */
defineProps<{
  group: 'colors' | 'general' | 'style' | 'tokens'
}>()

const {
  neutral,
  primary,
  radius,
  fontSize,
  spacing,
  fonts,
  font,
  icon,
  icons
} = useTheme()

const { isCustomPalette, style, setStyle } = useThemeStudio()

const semanticAliases: ColorAlias[] = ['secondary', 'success', 'info', 'warning', 'error']

const SHADOW_STYLE_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Default', value: 'soft' },
  { label: 'Custom', value: 'hard' }
] as const

const shadowOpacity = computed({
  get: () => style.value.shadowOpacity ?? (style.value.shadow === 'hard' ? 100 : 25),
  set: (value: number) => setStyle({ shadowOpacity: value })
})

const innerShadowOpacity = computed({
  get: () => style.value.innerShadowOpacity ?? 15,
  set: (value: number) => setStyle({ innerShadowOpacity: value })
})

const innerShadowColor = computed({
  get: () => style.value.innerShadowColor || 'default',
  set: (value: any) => setStyle({ innerShadowColor: value })
})

function innerGeometrySlider(key: 'x' | 'y' | 'blur' | 'spread') {
  return computed({
    get: () => ({ ...INNER_SHADOW_GEOMETRY_DEFAULTS, ...style.value.innerShadowGeometry })[key],
    set: (value: number) => setStyle({ innerShadowGeometry: { ...INNER_SHADOW_GEOMETRY_DEFAULTS, ...style.value.innerShadowGeometry, [key]: value } })
  })
}

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
  { label: 'Neutral shade', value: 'shade' },
  { label: 'Primary shade', value: 'primary-shade' }
]

const shadowColorItems = [
  { label: 'Default', value: 'default' },
  { label: 'Black', value: 'black' },
  { label: 'Inverted', value: 'inverted' },
  { label: 'Primary', value: 'primary' },
  { label: 'Neutral shade', value: 'shade' },
  { label: 'Primary shade', value: 'primary-shade' }
]

// Slider position ↔ SHADES index, per mode. shadow/border shades write both
// modes on first touch (explicit 'shade' mode choice); token shades write
// ONLY the touched mode so an untouched mode never becomes an override.
function shadeSlider(field: 'shadowShade' | 'innerShadowShade' | 'borderShade', defaults: { light: number, dark: number }, target: 'light' | 'dark') {
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

const innerShadowShades = {
  light: shadeSlider('innerShadowShade', SHADOW_SHADE_DEFAULTS, 'light'),
  dark: shadeSlider('innerShadowShade', SHADOW_SHADE_DEFAULTS, 'dark')
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

/**
 * Same hydration-adoption problem for every control: SSR renders default
 * state (no localStorage), and persisted slider positions/selections looked
 * stale until touched. One post-mount re-render — only when saved state
 * exists — puts everything on client truth.
 */
const hydrationKey = ref(0)

onMounted(() => {
  // ANY persisted theme state means the SSR markup rendered defaults —
  // fonts, icon sets and palette picks included, not just the studio axes.
  if (Object.keys(localStorage).some(key => key.startsWith('nuxt-ui-'))) {
    hydrationKey.value = 1
  }
})

// One curve editor per alias, toggled by the edit icon next to each select.
const paletteEditors = reactive<Record<string, boolean>>({})

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
  { key: 'buttons' as const, label: 'Button Defaults', hasColor: true, items: variantItems(['solid', 'outline', 'soft', 'subtle', 'ghost', 'link']) },
  { key: 'panels' as const, label: 'Card Defaults', hasColor: false, items: variantItems(['solid', 'outline', 'soft', 'subtle']) },
  { key: 'inputs' as const, label: 'Input Defaults', hasColor: true, items: variantItems(['outline', 'soft', 'subtle', 'ghost', 'none']) }
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

const defaultColorItems = ['default', 'primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'].map(value => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
  chip: value === 'default' ? undefined : { color: value as any }
}))

function groupColorModel(group: VariantGroup) {
  return computed({
    get: () => style.value.defaults?.colors?.[group] || 'default',
    set: (value: any) => setStyle({ defaults: { ...style.value.defaults, colors: { ...style.value.defaults?.colors, [group]: value } } })
  })
}

const groupColors = Object.fromEntries(variantGroupFields.map(field => [field.key, groupColorModel(field.key)])) as Record<VariantGroup, ReturnType<typeof groupColorModel>>

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

const innerGeometry = Object.fromEntries(geometryFields.map(field => [field.key, innerGeometrySlider(field.key)])) as Record<'x' | 'y' | 'blur' | 'spread', ReturnType<typeof innerGeometrySlider>>

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
  <div :key="hydrationKey">
    <template v-if="group === 'colors'">
      <div class="flex flex-col gap-2.5">
        <ThemeStudioSection label="Primary" help-to="/docs/getting-started/theme/css-variables#colors">
          <div>
            <div class="flex w-full items-center gap-1.5">
              <ThemeStudioColorMenu alias="primary" class="flex-1 min-w-0" />

              <UButton
                :icon="isCustomPalette('primary') ? 'i-lucide-paintbrush' : 'i-lucide-pencil'"
                color="neutral"
                variant="ghost"
                size="sm"
                :active="paletteEditors.primary || isCustomPalette('primary')"
                active-color="primary"
                active-variant="subtle"
                aria-label="Edit primary palette"
                @click="paletteEditors.primary = !paletteEditors.primary"
              />
            </div>

            <ThemeStudioPaletteEditor v-model:open="paletteEditors.primary" alias="primary" />
          </div>
        </ThemeStudioSection>

        <USeparator />

        <ThemeStudioSection label="Neutral" help-to="/docs/getting-started/theme/css-variables#text">
          <div>
            <div class="flex w-full items-center gap-1.5">
              <ThemeStudioColorMenu alias="neutral" class="flex-1 min-w-0" />

              <UButton
                :icon="isCustomPalette('neutral') ? 'i-lucide-paintbrush' : 'i-lucide-pencil'"
                color="neutral"
                variant="ghost"
                size="sm"
                :active="paletteEditors.neutral || isCustomPalette('neutral')"
                active-color="primary"
                active-variant="subtle"
                aria-label="Edit background palette"
                @click="paletteEditors.neutral = !paletteEditors.neutral"
              />
            </div>

            <ThemeStudioPaletteEditor v-model:open="paletteEditors.neutral" alias="neutral" />
          </div>
        </ThemeStudioSection>

        <USeparator />

        <ThemeStudioSection label="Semantic" help-to="/docs/getting-started/theme/design-system">
          <div class="flex flex-col gap-1.5">
            <div v-for="alias in semanticAliases" :key="alias">
              <div class="flex items-center gap-2">
                <span class="text-[11px] text-muted w-13 shrink-0 capitalize select-none">{{ alias }}</span>

                <div class="flex flex-1 min-w-0 items-center gap-1.5">
                  <ThemeStudioColorMenu :alias="alias" class="flex-1 min-w-0" />

                  <UButton
                    :icon="isCustomPalette(alias) ? 'i-lucide-paintbrush' : 'i-lucide-pencil'"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    :active="paletteEditors[alias] || isCustomPalette(alias)"
                    active-color="primary"
                    active-variant="subtle"
                    :aria-label="`Edit ${alias} palette`"
                    @click="paletteEditors[alias] = !paletteEditors[alias]"
                  />
                </div>
              </div>

              <ThemeStudioPaletteEditor v-model:open="paletteEditors[alias]" :alias="alias" />
            </div>
          </div>
        </ThemeStudioSection>
      </div>
    </template>

    <template v-else-if="group === 'style'">
      <div class="flex flex-col gap-2.5">
        <ThemeStudioSection label="Shadow">
          <div>
            <div class="grid grid-cols-3 gap-1">
              <ThemeStudioPickerButton
                v-for="option in SHADOW_STYLE_OPTIONS"
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
        </ThemeStudioSection>

        <USeparator />

        <ThemeStudioSection label="Inner shadow">
          <div>
            <div class="grid grid-cols-3 gap-1">
              <ThemeStudioPickerButton
                v-for="option in SHADOW_STYLE_OPTIONS"
                :key="option.value"
                :label="option.label"
                :selected="(style.innerShadow || 'none') === option.value"
                @click="setStyle({ innerShadow: option.value })"
              />
            </div>

            <div v-if="(style.innerShadow || 'none') !== 'none'" class="mt-1.5 flex flex-col gap-2">
              <USelect
                v-model="innerShadowColor"
                size="sm"
                color="neutral"
                icon="i-lucide-paint-bucket"
                :items="shadowColorItems"
                class="w-full"
              />

              <template v-if="innerShadowColor === 'shade' || innerShadowColor === 'primary-shade'">
                <ThemeStudioShadeSlider
                  v-for="(slider, modeName) in innerShadowShades"
                  :key="modeName"
                  v-model="slider.value"
                  :mode="modeName"
                  :chip="innerShadowColor === 'primary-shade' ? primaryChip : neutralChip"
                />
              </template>

              <div class="flex items-center gap-2">
                <span class="text-[11px] text-muted w-13 shrink-0 select-none">Opacity</span>

                <USlider v-model="innerShadowOpacity" :min="5" :max="100" :step="5" size="xs" />

                <span class="text-[11px] text-dimmed font-mono w-8 text-right shrink-0">{{ innerShadowOpacity }}%</span>
              </div>

              <template v-if="style.innerShadow === 'hard'">
                <div v-for="field in geometryFields" :key="field.key" class="flex items-center gap-2">
                  <span class="text-[11px] text-muted w-13 shrink-0 select-none">{{ field.label }}</span>

                  <USlider v-model="innerGeometry[field.key].value" :min="field.min" :max="field.max" :step="1" size="xs" />

                  <span class="text-[11px] text-dimmed font-mono w-8 text-right shrink-0">{{ innerGeometry[field.key].value }}px</span>
                </div>
              </template>
            </div>
          </div>
        </ThemeStudioSection>

        <USeparator />

        <ThemeStudioSection label="Borders">
          <div>
            <div class="grid grid-cols-3 gap-1">
              <ThemeStudioPickerButton
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
        </ThemeStudioSection>
      </div>
    </template>

    <template v-else-if="group === 'tokens'">
      <div class="flex flex-col gap-2.5">
        <template v-for="(tokenGroup, index) in tokenGroups" :key="tokenGroup.key">
          <USeparator v-if="index" />

          <ThemeStudioSection :label="tokenGroup.label">
            <div class="flex flex-col gap-3">
              <div v-for="section in tokenGroup.sections" :key="section.token" class="flex flex-col gap-1.5">
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
          </ThemeStudioSection>
        </template>
      </div>
    </template>

    <template v-else-if="group === 'general'">
      <div class="flex flex-col gap-2.5">
        <ThemeStudioSection label="Font" help-to="/docs/getting-started/integrations/fonts">
          <div>
            <USelect
              v-model="font"
              size="sm"
              color="neutral"
              variant="subtle"
              icon="i-lucide-type"
              :items="fonts"
              class="w-full"
            />
          </div>
        </ThemeStudioSection>

        <USeparator />

        <ThemeStudioSection label="Icons" help-to="/docs/getting-started/integrations/icons">
          <div>
            <USelect
              v-model="icon"
              size="sm"
              color="neutral"
              variant="subtle"
              :icon="icons.find(i => i.value === icon)?.icon"
              :items="icons"
              class="w-full capitalize"
              :ui="{ item: 'capitalize' }"
            />
          </div>
        </ThemeStudioSection>

        <USeparator />

        <ThemeStudioSection label="Scale">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <span class="text-[11px] text-muted w-13 shrink-0 select-none">Radius</span>

              <USlider
                v-model="radius"
                :min="0"
                :max="0.5"
                :step="0.125"
                size="xs"
              />

              <span class="text-[11px] text-dimmed font-mono w-10 text-right shrink-0">{{ radius }}rem</span>
            </div>

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

            <div class="flex items-center gap-2">
              <span class="text-[11px] text-muted w-13 shrink-0 select-none">Size</span>

              <USelect
                v-model="defaultSize"
                size="sm"
                color="neutral"
                variant="subtle"
                icon="i-lucide-proportions"
                :items="defaultSizeItems"
                class="flex-1"
              />
            </div>
          </div>
        </ThemeStudioSection>

        <USeparator />

        <template v-for="field in variantGroupFields" :key="field.key">
          <ThemeStudioSection :label="field.label">
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center gap-2">
                <span class="text-[11px] text-muted w-13 shrink-0 select-none">Variant</span>

                <USelect
                  v-model="groupVariants[field.key].value"
                  size="sm"
                  color="neutral"
                  variant="subtle"
                  icon="i-lucide-layers"
                  :items="field.items"
                  class="flex-1"
                />
              </div>

              <div v-if="field.hasColor" class="flex items-center gap-2">
                <span class="text-[11px] text-muted w-13 shrink-0 select-none">Color</span>

                <USelect
                  v-model="groupColors[field.key].value"
                  size="sm"
                  color="neutral"
                  variant="subtle"
                  :items="defaultColorItems"
                  class="flex-1"
                >
                  <template #leading>
                    <UChip
                      v-if="groupColors[field.key].value !== 'default'"
                      :color="groupColors[field.key].value as any"
                      inset
                      standalone
                    />
                    <UIcon v-else name="i-lucide-palette" class="size-4 shrink-0 text-dimmed" />
                  </template>
                </USelect>
              </div>
            </div>
          </ThemeStudioSection>

          <USeparator v-if="field.key !== 'inputs'" />
        </template>
      </div>
    </template>
  </div>
</template>
