<script setup lang="ts">
import { TOKEN_SHADE_TARGETS, SHADES, SHADOW_SHADE_DEFAULTS, BORDER_SHADE_DEFAULTS } from '../../utils/theme-engine'

const colorMode = useColorMode()

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
  { label: 'Hard', value: 'hard' }
] as const

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
  { label: 'Neutral shade…', value: 'shade' }
]

const shadowColorItems = [
  { label: 'Default (ink)', value: 'default' },
  { label: 'Black', value: 'black' },
  { label: 'Inverted', value: 'inverted' },
  { label: 'Primary', value: 'primary' },
  { label: 'Neutral shade…', value: 'shade' }
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

const primaryEditorOpen = ref(false)
const neutralEditorOpen = ref(false)

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
  <div class="flex flex-col gap-5">
    <fieldset>
      <legend class="w-full text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1 cursor-pointer">
        <button type="button" class="flex items-center gap-1 flex-1 text-left cursor-pointer" @click="openSections.primary = !openSections.primary">
          Primary

          <UIcon name="i-lucide-chevron-down" class="size-3 text-dimmed transition-transform duration-200" :class="{ '-rotate-90': !openSections.primary }" />
        </button>

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
        <button type="button" class="flex items-center gap-1 flex-1 text-left cursor-pointer" @click="openSections.neutral = !openSections.neutral">
          Neutral

          <UIcon name="i-lucide-chevron-down" class="size-3 text-dimmed transition-transform duration-200" :class="{ '-rotate-90': !openSections.neutral }" />
        </button>

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

    <fieldset>
      <legend class="w-full text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1 cursor-pointer">
        <button type="button" class="flex items-center gap-1 flex-1 text-left cursor-pointer" @click="openSections.radius = !openSections.radius">
          Radius

          <UIcon name="i-lucide-chevron-down" class="size-3 text-dimmed transition-transform duration-200" :class="{ '-rotate-90': !openSections.radius }" />
        </button>

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
        <button type="button" class="flex items-center gap-1 flex-1 text-left cursor-pointer" @click="openSections.shadows = !openSections.shadows">
          Shadows

          <UIcon name="i-lucide-chevron-down" class="size-3 text-dimmed transition-transform duration-200" :class="{ '-rotate-90': !openSections.shadows }" />
        </button>
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
        </div>
      </div>
    </fieldset>

    <fieldset>
      <legend class="w-full text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1 cursor-pointer">
        <button type="button" class="flex items-center gap-1 flex-1 text-left cursor-pointer" @click="openSections.borders = !openSections.borders">
          Borders

          <UIcon name="i-lucide-chevron-down" class="size-3 text-dimmed transition-transform duration-200" :class="{ '-rotate-90': !openSections.borders }" />
        </button>
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

    <fieldset v-for="section in tokenSections" :key="section.token">
      <legend class="w-full text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1 cursor-pointer">
        <button type="button" class="flex items-center gap-1 flex-1 text-left cursor-pointer" @click="openSections[section.token] = !openSections[section.token]">
          {{ section.label }}

          <UIcon name="i-lucide-chevron-down" class="size-3 text-dimmed transition-transform duration-200" :class="{ '-rotate-90': !openSections[section.token] }" />
        </button>
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

    <fieldset>
      <legend class="w-full text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1 cursor-pointer">
        <button type="button" class="flex items-center gap-1 flex-1 text-left cursor-pointer" @click="openSections.font = !openSections.font">
          Font

          <UIcon name="i-lucide-chevron-down" class="size-3 text-dimmed transition-transform duration-200" :class="{ '-rotate-90': !openSections.font }" />
        </button>

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
        <button type="button" class="flex items-center gap-1 flex-1 text-left cursor-pointer" @click="openSections.icons = !openSections.icons">
          Icons

          <UIcon name="i-lucide-chevron-down" class="size-3 text-dimmed transition-transform duration-200" :class="{ '-rotate-90': !openSections.icons }" />
        </button>

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

    <fieldset>
      <legend class="w-full text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1 cursor-pointer">
        <button type="button" class="flex items-center gap-1 flex-1 text-left cursor-pointer" @click="openSections.mode = !openSections.mode">
          Color Mode

          <UIcon name="i-lucide-chevron-down" class="size-3 text-dimmed transition-transform duration-200" :class="{ '-rotate-90': !openSections.mode }" />
        </button>

        <UButton
          to="/docs/getting-started/integrations/color-mode"
          size="xs"
          color="neutral"
          variant="link"
          icon="i-lucide-help-circle"
          class="p-0 -my-0.5"
          :ui="{ leadingIcon: 'size-3' }"
        />
      </legend>

      <div v-show="openSections.mode" class="grid grid-cols-3 gap-1">
        <ThemePickerButton
          v-for="m in modes"
          :key="m.label"
          v-bind="m"
          :selected="colorMode.preference === m.label"
          @click="mode = m.label"
        />
      </div>
    </fieldset>
  </div>
</template>
