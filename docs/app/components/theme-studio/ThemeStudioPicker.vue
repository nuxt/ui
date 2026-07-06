<script setup lang="ts">
const colorMode = useColorMode()
const { track } = useAnalytics()

const open = ref(false)

watch(open, (isOpen) => {
  if (isOpen) {
    track('Theme Picker Opened')
  }
})

const { copy: copyCSS, copied: copiedCSS } = useClipboard()
const { copy: copyConfig, copied: copiedConfig } = useClipboard()

const {
  radiuses,
  radius,
  modes,
  mode,
  hasCSSChanges,
  hasConfigChanges,
  configLabel,
  exportCSS,
  exportConfig,
  resetTheme
} = useTheme()

const { studioOpen } = useThemeStudio()

function openStudio() {
  open.value = false
  studioOpen.value = true
}
</script>

<template>
  <UPopover v-model:open="open" :ui="{ content: 'w-72 p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-5rem)]' }">
    <template #default>
      <UButton
        icon="i-lucide-swatch-book"
        color="neutral"
        :variant="open ? 'soft' : 'ghost'"
        square
        aria-label="Color picker"
        :ui="{ leadingIcon: 'text-primary' }"
      />
    </template>

    <template #content>
      <ThemeStudioPresetMenu />

      <UButton
        label="Open Theme Studio"
        icon="i-lucide-swatch-book"
        color="neutral"
        variant="subtle"

        block
        @click="openStudio"
      />

      <fieldset>
        <legend class="text-[11px] leading-none font-semibold mb-2 select-none flex items-center gap-1">
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

        <ThemeStudioColorMenu alias="primary" class="w-full" />
      </fieldset>

      <fieldset>
        <legend class="text-[11px] leading-none font-semibold mb-2 select-none flex items-center gap-1">
          Background

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

        <ThemeStudioColorMenu alias="neutral" class="w-full" />
      </fieldset>

      <fieldset>
        <legend class="text-[11px] leading-none font-semibold mb-2 select-none flex items-center gap-1">
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

        <UFieldGroup class="w-full">
          <ThemeStudioPickerButton
            v-for="r in radiuses"
            :key="r"
            :label="String(r)"
            class="grow"
            :selected="radius === r"
            @click="radius = r"
          />
        </UFieldGroup>
      </fieldset>

      <fieldset>
        <legend class="text-[11px] leading-none font-semibold mb-2 select-none flex items-center gap-1">
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
          <ThemeStudioPickerButton
            v-for="m in modes"
            :key="m.label"
            v-bind="m"
            :selected="colorMode.preference === m.label"
            @click="mode = m.label"
          />
        </div>
      </fieldset>

      <fieldset v-if="hasCSSChanges || hasConfigChanges">
        <legend class="text-[11px] leading-none font-semibold mb-2 select-none">
          Export
        </legend>

        <div class="flex items-center justify-between gap-1">
          <UButton
            v-if="hasCSSChanges"
            color="neutral"
            variant="subtle"

            label="main.css"
            class="flex-1 text-[11px]"
            :icon="copiedCSS ? 'i-lucide-copy-check' : 'i-lucide-copy'"
            @click="copyCSS(exportCSS()); track('Theme Exported', { type: 'CSS' })"
          />
          <UButton
            v-if="hasConfigChanges"
            color="neutral"
            variant="subtle"

            :label="configLabel"
            :icon="copiedConfig ? 'i-lucide-copy-check' : 'i-lucide-copy'"
            class="flex-1 text-[11px]"
            @click="copyConfig(exportConfig()); track('Theme Exported', { type: 'Config' })"
          />
          <UTooltip text="Reset theme">
            <UButton
              color="neutral"
              variant="subtle"

              icon="i-lucide-rotate-ccw"
              class="ms-auto"
              @click="resetTheme"
            />
          </UTooltip>
        </div>
      </fieldset>
    </template>
  </UPopover>
</template>
