<script setup lang="ts">
import { resolveAlias, resolveShade } from '../../utils/theme-engine'
import type { ThemeDoc } from '../../utils/theme-engine'

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

const { presets, activePreset, applyPreset, shuffle, studioOpen } = useThemeStudio()

/** The preset's primary + neutral at 500, straight from its own document. */
function presetSwatches(doc: ThemeDoc): string[] {
  const primaryColor = doc.blackAsPrimary ? 'black' : resolveShade(doc, resolveAlias(doc, 'primary'), 500)
  const neutralColor = resolveShade(doc, resolveAlias(doc, 'neutral'), 500)
  return [primaryColor, neutralColor].filter((color): color is string => !!color)
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
      <div class="flex gap-1.5">
        <UDropdownMenu :items="presetItems" :content="{ align: 'start' }" class="flex-1 min-w-0" :ui="{ itemTrailing: 'self-center', content: 'w-(--reka-dropdown-menu-trigger-width)' }">
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

        <ThemePickerColorMenu alias="primary" class="w-full" />
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

        <ThemePickerColorMenu alias="neutral" class="w-full" />
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
          <ThemePickerButton
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
          <ThemePickerButton
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
            @click="copyCSS(exportCSS())"
          />
          <UButton
            v-if="hasConfigChanges"
            color="neutral"
            variant="subtle"

            :label="configLabel"
            :icon="copiedConfig ? 'i-lucide-copy-check' : 'i-lucide-copy'"
            class="flex-1 text-[11px]"
            @click="copyConfig(exportConfig())"
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
