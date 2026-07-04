<script setup lang="ts">
const colorMode = useColorMode()

const {
  neutralColors,
  neutral,
  primaryColors,
  primary,
  blackAsPrimary,
  setBlackAsPrimary,
  radiuses,
  radius,
  fonts,
  font,
  icon,
  icons,
  modes,
  mode
} = useTheme()

const { selectPalette } = useThemeStudio()
</script>

<template>
  <div class="flex flex-col gap-6">
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

      <div class="grid grid-cols-3 gap-1">
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

      <div class="grid grid-cols-3 gap-1">
        <ThemePickerButton
          v-for="color in neutralColors"
          :key="color"
          :label="color"
          :chip="color === 'neutral' ? 'old-neutral' : color"
          :selected="neutral === color"
          @click="selectPalette('neutral', color)"
        />
      </div>

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

      <div class="grid grid-cols-5 gap-1">
        <ThemePickerButton
          v-for="r in radiuses"
          :key="r"
          :label="String(r)"
          class="justify-center px-0"
          :selected="radius === r"
          @click="radius = r"
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
