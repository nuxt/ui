<script setup lang="ts">
import { TOKEN_SHADE_TARGETS, SHADES, SHADOW_SHADE_DEFAULTS, BORDER_SHADE_DEFAULTS, SHADOW_GEOMETRY_DEFAULTS } from '../../utils/theme-engine'

const {
  neutralColors,
  neutral,
  primaryColors,
  primary,
  blackAsPrimary,
  setBlackAsPrimary,
  radius,
  fonts,
  font,
  icon,
  icons,
  modes,
  mode
} = useTheme()

const { selectPalette, isCustomPalette, style, setStyle } = useThemeStudio()

const openSections = reactive<Record<string, boolean>>({
  primary: true,
  neutral: true,
  radius: true,
  defaults: true,
  shadows: true,
  borders: true,
  font: true,
  icons: true,
  mode: true,
  // token sections keyed by token name; only the background starts open
  ...Object.fromEntries(TOKEN_SHADE_TARGETS.map((target, index) => [target.token, index === 0]))
})

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
  { label: 'Soft', value: 'soft' },
  { label: 'Custom', value: 'hard' }
] as const

const shadowOpacity = computed({
  get: () => style.value.shadowOpacity ?? (style.value.shadow === 'hard' ? 100 : 25),
  set: (value: number) => setStyle({ shadowOpacity: value })
})

const borderOptions = [
  { label: 'Thin', value: 'default' },
  { label: 'Bold', value: 'bold' },
  { label: 'Frame', value: 'frame' }
] as const

const borderColorItems = [
  { label: 'Default', value: 'default' },
  { label: 'Inverted', value: 'inverted' },
  { label: 'Black', value: 'black' },
  { label: 'White', value: 'white' },
  { label: 'Primary', value: 'primary' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Custom…', value: 'shade' }
]

const shadowColorItems = [
  { label: 'Default (ink)', value: 'default' },
  { label: 'Black', value: 'black' },
  { label: 'Inverted', value: 'inverted' },
  { label: 'Primary', value: 'primary' },
  { label: 'Custom…', value: 'shade' }
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

const neutralChip = computed(() => neutral.value === 'neutral' ? 'old-neutral' : neutral.value)

const modeTabs = computed(() => modes.value.map(m => ({ label: m.label, icon: m.icon, value: m.label })))

const primaryEditorOpen = ref(false)
const neutralEditorOpen = ref(false)

const openGroups = ref('colors')

const groupItems = [
  { label: 'Colors', value: 'colors', slot: 'colors' as const },
  { label: 'Style', value: 'style', slot: 'style' as const },
  { label: 'Tokens', value: 'tokens', slot: 'tokens' as const },
  { label: 'General', value: 'general', slot: 'general' as const }
]

const defaultVariantItems = [
  { label: 'Default', value: 'default' },
  { label: 'Solid', value: 'solid' },
  { label: 'Outline', value: 'outline' },
  { label: 'Soft', value: 'soft' },
  { label: 'Subtle', value: 'subtle' }
]

const defaultSizeItems = [
  { label: 'Default', value: 'default' },
  { label: 'XS', value: 'xs' },
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'md' },
  { label: 'LG', value: 'lg' },
  { label: 'XL', value: 'xl' }
]

const defaultVariant = computed({
  get: () => style.value.defaults?.variant || 'default',
  set: (value: any) => setStyle({ defaults: { ...style.value.defaults, variant: value } })
})

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
  <div class="flex flex-col gap-3">
    <UTabs
      v-model="mode"
      :items="modeTabs"
      :content="false"
      size="xs"
      color="primary"
      class="w-full"
      :ui="{ trigger: 'text-[11px] capitalize' }"
    />

    <UAccordion
      v-model="openGroups"

      :items="groupItems"
      :unmount-on-hide="false"
    >
      <template #colors>
        <div class="flex flex-col gap-5 pt-1 pb-4">
          <fieldset>
            <legend class="w-full text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Primary"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                class="flex-1 justify-start -my-1 -ms-1.5 gap-1 text-xs font-semibold text-default"
                :ui="{ leadingIcon: ['size-3 text-dimmed transition-transform duration-200', !openSections.primary && '-rotate-90'] }"
                @click="openSections.primary = !openSections.primary"
              />

              <UButton
                to="/docs/getting-started/theme/css-variables#colors"
                size="xs"
                color="neutral"
                variant="link"
                icon="i-lucide-help-circle"
                class="p-0 -my-0.5"
                :ui="{ leadingIcon: 'size-3' }"
              />

              <UButton
                label="Custom"
                :icon="isCustomPalette('primary') ? 'i-lucide-paintbrush' : 'i-lucide-wand-sparkles'"
                color="neutral"
                :variant="primaryEditorOpen ? 'soft' : 'ghost'"
                size="xs"
                class="-my-1 text-[11px]"
                :ui="{ leadingIcon: isCustomPalette('primary') ? 'text-primary size-3' : 'size-3' }"
                @click="primaryEditorOpen = !primaryEditorOpen"
              />
            </legend>

            <div v-show="openSections.primary">
              <UPopover :content="{ side: 'bottom', align: 'start' }">
                <UButton
                  color="neutral"
                  variant="outline"
                  size="sm"
                  block
                  trailing-icon="i-lucide-chevron-down"
                  class="justify-start capitalize ring-default rounded-sm text-[11px] hover:bg-elevated/50 data-[state=open]:bg-elevated/50"
                  :ui="{ trailingIcon: 'ms-auto size-4 group-data-[state=open]:rotate-180 transition-transform duration-200' }"
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
                  <div class="grid grid-cols-3 gap-1 w-72 p-2">
                    <ThemePickerButton
                      label="Black"
                      :selected="blackAsPrimary"
                      @click="setBlackAsPrimary(true)"
                    >
                      <template #leading>
                        <span class="inline-block size-2 rounded-full bg-black dark:bg-white" />
                      </template>
                    </ThemePickerButton>

                    <ThemePickerButton
                      v-for="color in primaryColors"
                      :key="color"
                      :label="color"
                      :chip="color"
                      :selected="!blackAsPrimary && primary === color"
                      @click="selectPalette('primary', color)"
                    />
                  </div>
                </template>
              </UPopover>

              <ThemeStudioPaletteEditor v-model:open="primaryEditorOpen" alias="primary" />
            </div>
          </fieldset>

          <fieldset>
            <legend class="w-full text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Neutral"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                class="flex-1 justify-start -my-1 -ms-1.5 gap-1 text-xs font-semibold text-default"
                :ui="{ leadingIcon: ['size-3 text-dimmed transition-transform duration-200', !openSections.neutral && '-rotate-90'] }"
                @click="openSections.neutral = !openSections.neutral"
              />

              <UButton
                to="/docs/getting-started/theme/css-variables#text"
                size="xs"
                color="neutral"
                variant="link"
                icon="i-lucide-help-circle"
                class="p-0 -my-0.5"
                :ui="{ leadingIcon: 'size-3' }"
              />

              <UButton
                label="Custom"
                :icon="isCustomPalette('neutral') ? 'i-lucide-paintbrush' : 'i-lucide-wand-sparkles'"
                color="neutral"
                :variant="neutralEditorOpen ? 'soft' : 'ghost'"
                size="xs"
                class="-my-1 text-[11px]"
                :ui="{ leadingIcon: isCustomPalette('neutral') ? 'text-primary size-3' : 'size-3' }"
                @click="neutralEditorOpen = !neutralEditorOpen"
              />
            </legend>

            <div v-show="openSections.neutral">
              <UPopover :content="{ side: 'bottom', align: 'start' }">
                <UButton
                  color="neutral"
                  variant="outline"
                  size="sm"
                  block
                  trailing-icon="i-lucide-chevron-down"
                  class="justify-start capitalize ring-default rounded-sm text-[11px] hover:bg-elevated/50 data-[state=open]:bg-elevated/50"
                  :ui="{ trailingIcon: 'ms-auto size-4 group-data-[state=open]:rotate-180 transition-transform duration-200' }"
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
                  <div class="grid grid-cols-3 gap-1 w-72 p-2">
                    <ThemePickerButton
                      v-for="color in neutralColors"
                      :key="color"
                      :label="color"
                      :chip="color === 'neutral' ? 'old-neutral' : color"
                      :selected="neutral === color"
                      @click="selectPalette('neutral', color)"
                    />
                  </div>
                </template>
              </UPopover>

              <ThemeStudioPaletteEditor v-model:open="neutralEditorOpen" alias="neutral" />
            </div>
          </fieldset>
        </div>
      </template>

      <template #style>
        <div class="flex flex-col gap-5 pt-1 pb-4">
          <fieldset>
            <legend class="w-full text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Radius"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                class="flex-1 justify-start -my-1 -ms-1.5 gap-1 text-xs font-semibold text-default"
                :ui="{ leadingIcon: ['size-3 text-dimmed transition-transform duration-200', !openSections.radius && '-rotate-90'] }"
                @click="openSections.radius = !openSections.radius"
              />

              <UButton
                to="/docs/getting-started/theme/css-variables#radius"
                size="xs"
                color="neutral"
                variant="link"
                icon="i-lucide-help-circle"
                class="p-0 -my-0.5"
                :ui="{ leadingIcon: 'size-3' }"
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

          <fieldset>
            <legend class="w-full text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Defaults"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                class="flex-1 justify-start -my-1 -ms-1.5 gap-1 text-xs font-semibold text-default"
                :ui="{ leadingIcon: ['size-3 text-dimmed transition-transform duration-200', !openSections.defaults && '-rotate-90'] }"
                @click="openSections.defaults = !openSections.defaults"
              />
            </legend>

            <div v-show="openSections.defaults" class="grid grid-cols-2 gap-1.5">
              <USelect
                v-model="defaultVariant"
                size="sm"
                color="neutral"
                icon="i-lucide-layers"
                :items="defaultVariantItems"
                class="ring-default rounded-sm hover:bg-elevated/50 text-xs data-[state=open]:bg-elevated/50"
                :ui="{ item: 'text-xs', trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
              />

              <USelect
                v-model="defaultSize"
                size="sm"
                color="neutral"
                icon="i-lucide-proportions"
                :items="defaultSizeItems"
                class="ring-default rounded-sm hover:bg-elevated/50 text-xs data-[state=open]:bg-elevated/50"
                :ui="{ item: 'text-xs', trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend class="w-full text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Shadows"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                class="flex-1 justify-start -my-1 -ms-1.5 gap-1 text-xs font-semibold text-default"
                :ui="{ leadingIcon: ['size-3 text-dimmed transition-transform duration-200', !openSections.shadows && '-rotate-90'] }"
                @click="openSections.shadows = !openSections.shadows"
              />
            </legend>

            <div v-show="openSections.shadows">
              <div class="grid grid-cols-3 gap-1">
                <ThemePickerButton
                  v-for="option in shadowOptions"
                  :key="option.value"
                  :label="option.label"
                  class="justify-center px-0"
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
                  class="w-full ring-default rounded-sm hover:bg-elevated/50 text-xs data-[state=open]:bg-elevated/50"
                  :ui="{ item: 'text-xs', trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
                />

                <template v-if="shadowColor === 'shade'">
                  <ThemeStudioShadeSlider
                    v-for="(slider, modeName) in shadowShades"
                    :key="modeName"
                    v-model="slider.value"
                    :mode="modeName"
                    :chip="neutralChip"
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

          <fieldset>
            <legend class="w-full text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Borders"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                class="flex-1 justify-start -my-1 -ms-1.5 gap-1 text-xs font-semibold text-default"
                :ui="{ leadingIcon: ['size-3 text-dimmed transition-transform duration-200', !openSections.borders && '-rotate-90'] }"
                @click="openSections.borders = !openSections.borders"
              />
            </legend>

            <div v-show="openSections.borders">
              <div class="grid grid-cols-3 gap-1">
                <ThemePickerButton
                  v-for="option in borderOptions"
                  :key="option.value"
                  :label="option.label"
                  class="justify-center px-0"
                  :selected="(style.border || 'default') === option.value"
                  @click="setStyle({ border: option.value })"
                />
              </div>

              <div class="mt-1.5 flex flex-col gap-2">
                <USelect
                  v-model="borderColor"
                  size="sm"
                  color="neutral"
                  icon="i-lucide-paint-bucket"
                  :items="borderColorItems"
                  class="w-full ring-default rounded-sm hover:bg-elevated/50 text-xs data-[state=open]:bg-elevated/50"
                  :ui="{ item: 'text-xs', trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
                />

                <template v-if="borderColor === 'shade'">
                  <ThemeStudioShadeSlider
                    v-for="(slider, modeName) in borderShades"
                    :key="modeName"
                    v-model="slider.value"
                    :mode="modeName"
                    :chip="neutralChip"
                  />
                </template>
              </div>
            </div>
          </fieldset>
        </div>
      </template>

      <template #tokens>
        <div class="flex flex-col gap-5 pt-1 pb-4">
          <fieldset v-for="section in tokenSections" :key="section.token">
            <legend class="w-full text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1 cursor-pointer">
              <UButton
                :label="section.label"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                class="flex-1 justify-start -my-1 -ms-1.5 gap-1 text-xs font-semibold text-default"
                :ui="{ leadingIcon: ['size-3 text-dimmed transition-transform duration-200', !openSections[section.token] && '-rotate-90'] }"
                @click="openSections[section.token] = !openSections[section.token]"
              />
            </legend>

            <div v-show="openSections[section.token]" class="flex flex-col gap-2">
              <ThemeStudioShadeSlider
                v-for="(slider, modeName) in section.sliders"
                :key="modeName"
                v-model="slider.value"
                :mode="modeName"
                :chip="neutralChip"
              />
            </div>
          </fieldset>
        </div>
      </template>

      <template #general>
        <div class="flex flex-col gap-5 pt-1 pb-4">
          <fieldset>
            <legend class="w-full text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Font"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                class="flex-1 justify-start -my-1 -ms-1.5 gap-1 text-xs font-semibold text-default"
                :ui="{ leadingIcon: ['size-3 text-dimmed transition-transform duration-200', !openSections.font && '-rotate-90'] }"
                @click="openSections.font = !openSections.font"
              />

              <UButton
                to="/docs/getting-started/integrations/fonts"
                size="xs"
                color="neutral"
                variant="link"
                icon="i-lucide-help-circle"
                class="p-0 -my-0.5"
                :ui="{ leadingIcon: 'size-3' }"
              />
            </legend>

            <div v-show="openSections.font">
              <USelect
                v-model="font"
                size="sm"
                color="neutral"
                icon="i-lucide-type"
                :items="fonts"
                class="w-full ring-default rounded-sm hover:bg-elevated/50 text-xs data-[state=open]:bg-elevated/50"
                :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend class="w-full text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1 cursor-pointer">
              <UButton
                label="Icons"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                class="flex-1 justify-start -my-1 -ms-1.5 gap-1 text-xs font-semibold text-default"
                :ui="{ leadingIcon: ['size-3 text-dimmed transition-transform duration-200', !openSections.icons && '-rotate-90'] }"
                @click="openSections.icons = !openSections.icons"
              />

              <UButton
                to="/docs/getting-started/integrations/icons"
                size="xs"
                color="neutral"
                variant="link"
                icon="i-lucide-help-circle"
                class="p-0 -my-0.5"
                :ui="{ leadingIcon: 'size-3' }"
              />
            </legend>

            <div v-show="openSections.icons">
              <USelect
                v-model="icon"
                size="sm"
                color="neutral"
                :icon="icons.find(i => i.value === icon)?.icon"
                :items="icons"
                class="w-full ring-default rounded-sm hover:bg-elevated/50 capitalize text-xs data-[state=open]:bg-elevated/50"
                :ui="{ item: 'capitalize text-xs', trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
              />
            </div>
          </fieldset>
        </div>
      </template>
    </UAccordion>
  </div>
</template>
