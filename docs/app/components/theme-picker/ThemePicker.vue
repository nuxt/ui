<script setup lang="ts">
import colors from 'tailwindcss/colors'
import { useClipboard } from '@vueuse/core'
import { themeIcons } from '../../utils/theme'
import { omit } from '#ui/utils'

const appConfig = useAppConfig()
const colorMode = useColorMode()
const { track } = useAnalytics()

const open = ref(false)

watch(open, (isOpen) => {
  if (isOpen) {
    track('Theme Picker Opened')
  }
})

const { copy: copyCSS, copied: copiedCSS } = useClipboard()
const { copy: copyAppConfig, copied: copiedAppConfig } = useClipboard()

const neutralColors = ['slate', 'gray', 'zinc', 'neutral', 'stone']
const neutral = computed({
  get() {
    return appConfig.ui.colors.neutral
  },
  set(option) {
    appConfig.ui.colors.neutral = option
    window.localStorage.setItem('nuxt-ui-neutral', appConfig.ui.colors.neutral)
    track('Theme Changed', { setting: 'neutral', value: option })
  }
})

const colorsToOmit = ['inherit', 'current', 'transparent', 'black', 'white', ...neutralColors]
const primaryColors = Object.keys(omit(colors, colorsToOmit as any))
const primary = computed({
  get() {
    return appConfig.ui.colors.primary
  },
  set(option) {
    appConfig.ui.colors.primary = option
    window.localStorage.setItem('nuxt-ui-primary', appConfig.ui.colors.primary)
    setBlackAsPrimary(false)
    track('Theme Changed', { setting: 'primary', value: option })
  }
})

const radiuses = [0, 0.125, 0.25, 0.375, 0.5]
const radius = computed({
  get() {
    return appConfig.theme.radius
  },
  set(option) {
    appConfig.theme.radius = option
    window.localStorage.setItem('nuxt-ui-radius', String(appConfig.theme.radius))
    track('Theme Changed', { setting: 'radius', value: option })
  }
})

const fonts = ['Public Sans', 'DM Sans', 'Geist', 'Inter', 'Poppins', 'Outfit', 'Raleway']
const font = computed({
  get() {
    return appConfig.theme.font
  },
  set(option) {
    appConfig.theme.font = option
    window.localStorage.setItem('nuxt-ui-font', appConfig.theme.font)
    track('Theme Changed', { setting: 'font', value: option })
  }
})

const icons = [{
  label: 'Lucide',
  icon: 'i-lucide-feather',
  value: 'lucide'
}, {
  label: 'Phosphor',
  icon: 'i-ph-phosphor-logo',
  value: 'phosphor'
}, {
  label: 'Tabler',
  icon: 'i-tabler-brand-tabler',
  value: 'tabler'
}]
const icon = computed({
  get() {
    return appConfig.theme.icons
  },
  set(option) {
    appConfig.theme.icons = option
    appConfig.ui.icons = themeIcons[option as keyof typeof themeIcons] as any
    window.localStorage.setItem('nuxt-ui-icons', appConfig.theme.icons)
    track('Theme Changed', { setting: 'icons', value: option })
  }
})

const modes = [
  { label: 'light', icon: appConfig.ui.icons.light },
  { label: 'dark', icon: appConfig.ui.icons.dark },
  { label: 'system', icon: appConfig.ui.icons.system }
]
const mode = computed({
  get() {
    return colorMode.value
  },
  set(option) {
    colorMode.preference = option
    track('Theme Changed', { setting: 'colorMode', value: option })
  }
})

function setBlackAsPrimary(value: boolean) {
  appConfig.theme.blackAsPrimary = value
  window.localStorage.setItem('nuxt-ui-black-as-primary', String(value))
  if (value) {
    track('Theme Changed', { setting: 'primary', value: 'black' })
  }
}

const hasCSSChanges = computed(() => {
  return appConfig.theme.radius !== 0.25
    || appConfig.theme.blackAsPrimary
    || appConfig.theme.font !== 'Public Sans'
})

const hasAppConfigChanges = computed(() => {
  return appConfig.ui.colors.primary !== 'green'
    || appConfig.ui.colors.neutral !== 'slate'
    || appConfig.theme.icons !== 'lucide'
})

function exportCSS() {
  track('Theme Exported', { type: 'CSS' })

  const lines = [
    '@import "tailwindcss";',
    '@import "@nuxt/ui";'
  ]

  if (appConfig.theme.font !== 'Public Sans') {
    lines.push('', '@theme {', `  --font-sans: '${appConfig.theme.font}', sans-serif;`, '}')
  }

  const rootLines: string[] = []
  if (appConfig.theme.radius !== 0.25) {
    rootLines.push(`  --ui-radius: ${appConfig.theme.radius}rem;`)
  }
  if (appConfig.theme.blackAsPrimary) {
    rootLines.push('  --ui-primary: black;')
  }

  if (rootLines.length) {
    lines.push('', ':root {', ...rootLines, '}')
  }

  if (appConfig.theme.blackAsPrimary) {
    lines.push('', '.dark {', '  --ui-primary: white;', '}')
  }

  copyCSS(lines.join('\n'))
}

function exportAppConfig() {
  track('Theme Exported', { type: 'AppConfig' })

  const config: Record<string, any> = {}

  if (appConfig.ui.colors.primary !== 'green' || appConfig.ui.colors.neutral !== 'slate') {
    config.ui = { colors: {} }
    if (appConfig.ui.colors.primary !== 'green') {
      config.ui.colors.primary = appConfig.ui.colors.primary
    }
    if (appConfig.ui.colors.neutral !== 'slate') {
      config.ui.colors.neutral = appConfig.ui.colors.neutral
    }
  }

  if (appConfig.theme.icons !== 'lucide') {
    const iconSet = appConfig.theme.icons
    const icons = themeIcons[iconSet as keyof typeof themeIcons]
    config.ui = config.ui || {}
    config.ui.icons = icons
  }

  const configString = JSON.stringify(config, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, '\'')

  const output = `export default defineAppConfig(${configString})`

  copyAppConfig(output)
}

function resetTheme() {
  track('Theme Reset')

  // Reset without triggering individual tracking events
  appConfig.ui.colors.primary = 'green'
  window.localStorage.removeItem('nuxt-ui-primary')

  appConfig.ui.colors.neutral = 'slate'
  window.localStorage.removeItem('nuxt-ui-neutral')

  appConfig.theme.radius = 0.25
  window.localStorage.removeItem('nuxt-ui-radius')

  appConfig.theme.font = 'Public Sans'
  window.localStorage.removeItem('nuxt-ui-font')

  appConfig.theme.icons = 'lucide'
  appConfig.ui.icons = themeIcons.lucide as any
  window.localStorage.removeItem('nuxt-ui-icons')

  appConfig.theme.blackAsPrimary = false
  window.localStorage.removeItem('nuxt-ui-black-as-primary')
}
</script>

<template>
  <UPopover v-model:open="open" :ui="{ content: 'w-72 px-6 py-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-5rem)]' }">
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

        <div class="grid grid-cols-3 gap-1 -mx-2">
          <ThemePickerButton
            label="Black"
            :selected="appConfig.theme.blackAsPrimary"
            @click="setBlackAsPrimary(true)"
          >
            <template #leading>
              <span class="inline-block w-2 h-2 rounded-full bg-black dark:bg-white" />
            </template>
          </ThemePickerButton>

          <ThemePickerButton
            v-for="color in primaryColors"
            :key="color"
            :label="color"
            :chip="color"
            :selected="!appConfig.theme.blackAsPrimary && primary === color"
            @click="primary = color"
          />
        </div>
      </fieldset>

      <fieldset>
        <legend class="text-[11px] leading-none font-semibold mb-2 select-none flex items-center gap-1">
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

        <div class="grid grid-cols-3 gap-1 -mx-2">
          <ThemePickerButton
            v-for="color in neutralColors"
            :key="color"
            :label="color"
            :chip="color === 'neutral' ? 'old-neutral' : color"
            :selected="neutral === color"
            @click="neutral = color"
          />
        </div>
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

        <div class="grid grid-cols-5 gap-1 -mx-2">
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
        <legend class="text-[11px] leading-none font-semibold mb-2 select-none flex items-center gap-1">
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

        <div class="-mx-2">
          <USelect
            v-model="font"
            size="sm"
            color="neutral"
            icon="i-lucide-type"
            :items="fonts"
            class="w-full ring-default rounded-sm hover:bg-elevated/50 text-[11px] data-[state=open]:bg-elevated/50"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
          />
        </div>
      </fieldset>

      <fieldset>
        <legend class="text-[11px] leading-none font-semibold mb-2 select-none flex items-center gap-1">
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

        <div class="-mx-2">
          <USelect
            v-model="icon"
            size="sm"
            color="neutral"
            :icon="icons.find(i => i.value === icon)?.icon"
            :items="icons"
            class="w-full ring-default rounded-sm hover:bg-elevated/50 capitalize text-[11px] data-[state=open]:bg-elevated/50"
            :ui="{ item: 'capitalize text-[11px]', trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
          />
        </div>
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

        <div class="grid grid-cols-3 gap-1 -mx-2">
          <ThemePickerButton
            v-for="m in modes"
            :key="m.label"
            v-bind="m"
            :selected="colorMode.preference === m.label"
            @click="mode = m.label"
          />
        </div>
      </fieldset>

      <fieldset v-if="hasCSSChanges || hasAppConfigChanges">
        <legend class="text-[11px] leading-none font-semibold mb-2 select-none">
          Export
        </legend>

        <div class="flex items-center justify-between gap-1 -mx-2">
          <UButton
            v-if="hasCSSChanges"
            color="neutral"
            variant="soft"
            size="sm"
            label="main.css"
            class="flex-1 text-[11px]"
            :icon="copiedCSS ? 'i-lucide-copy-check' : 'i-lucide-copy'"
            @click="exportCSS"
          />
          <UButton
            v-if="hasAppConfigChanges"
            color="neutral"
            variant="soft"
            size="sm"
            label="app.config.ts"
            :icon="copiedAppConfig ? 'i-lucide-copy-check' : 'i-lucide-copy'"
            class="flex-1 text-[11px]"
            @click="exportAppConfig"
          />
          <UTooltip text="Reset theme">
            <UButton
              color="neutral"
              variant="outline"
              size="sm"
              icon="i-lucide-rotate-ccw"
              class="ms-auto ring-default hover:bg-elevated/50"
              @click="resetTheme"
            />
          </UTooltip>
        </div>
      </fieldset>
    </template>
  </UPopover>
</template>
