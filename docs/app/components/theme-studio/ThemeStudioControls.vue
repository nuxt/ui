<script setup lang="ts">
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
  { label: 'Neutral', value: 'neutral' }
]

const shadowColorItems = [
  { label: 'Default (ink)', value: 'default' },
  { label: 'Black', value: 'black' },
  { label: 'Dark gray', value: 'dark' },
  { label: 'Medium gray', value: 'medium' },
  { label: 'Inverted', value: 'inverted' },
  { label: 'Primary', value: 'primary' }
]

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
      <legend class="text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1">
        Primary

        <UButton
          to="/docs/getting-started/theme/css-variables#colors"
          size="xs"
          color="neutral"
          variant="link"
          icon="i-lucide-help-circle"
          class="p-0 -my-0.5"
          :ui="{ leadingIcon: 'size-3' }"
        />
      </legend>

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

      <ThemeStudioPaletteEditor alias="primary" />
    </fieldset>

    <fieldset>
      <legend class="text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1">
        Neutral

        <UButton
          to="/docs/getting-started/theme/css-variables#text"
          size="xs"
          color="neutral"
          variant="link"
          icon="i-lucide-help-circle"
          class="p-0 -my-0.5"
          :ui="{ leadingIcon: 'size-3' }"
        />
      </legend>

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

      <ThemeStudioPaletteEditor alias="neutral" />
    </fieldset>

    <fieldset>
      <legend class="text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1">
        Radius

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

      <div class="flex items-center gap-3">
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
      <legend class="text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1">
        Shadows
      </legend>

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

      <div v-if="(style.shadow || 'none') !== 'none'" class="mt-1.5">
        <USelect
          v-model="shadowColor"
          size="sm"
          color="neutral"
          icon="i-lucide-paint-bucket"
          :items="shadowColorItems"
          class="w-full ring-default rounded-sm hover:bg-elevated/50 text-xs data-[state=open]:bg-elevated/50"
          :ui="{ item: 'text-xs', trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
        />
      </div>
    </fieldset>

    <fieldset>
      <legend class="text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1">
        Borders
      </legend>

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

      <div class="mt-1.5">
        <USelect
          v-model="borderColor"
          size="sm"
          color="neutral"
          icon="i-lucide-paint-bucket"
          :items="borderColorItems"
          class="w-full ring-default rounded-sm hover:bg-elevated/50 text-xs data-[state=open]:bg-elevated/50"
          :ui="{ item: 'text-xs', trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
        />
      </div>
    </fieldset>

    <fieldset>
      <legend class="text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1">
        Font

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

      <USelect
        v-model="font"
        size="sm"
        color="neutral"
        icon="i-lucide-type"
        :items="fonts"
        class="w-full ring-default rounded-sm hover:bg-elevated/50 text-xs data-[state=open]:bg-elevated/50"
        :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
      />
    </fieldset>

    <fieldset>
      <legend class="text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1">
        Icons

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

      <USelect
        v-model="icon"
        size="sm"
        color="neutral"
        :icon="icons.find(i => i.value === icon)?.icon"
        :items="icons"
        class="w-full ring-default rounded-sm hover:bg-elevated/50 capitalize text-xs data-[state=open]:bg-elevated/50"
        :ui="{ item: 'capitalize text-xs', trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
      />
    </fieldset>

    <fieldset>
      <legend class="text-xs leading-none font-semibold mb-2.5 select-none flex items-center gap-1">
        Color Mode

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

      <div class="grid grid-cols-3 gap-1">
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
