<template>
  <div class="flex items-center shadow-sm">
    <ClientOnly>
      <USelectMenu
        v-model="primary"
        name="primary"
        class="w-full [&>div>button]:!rounded-r-none"
        color="gray"
        :ui="{ width: 'w-[194px]' }"
        :popper="{ placement: 'bottom-start' }"
        :options="primaryOptions"
      >
        <template #label>
          <span class="flex-shrink-0 h-3 w-3 rounded-full" :style="{ backgroundColor: `${primary.hex}`}" />

          {{ primary.text }}
        </template>

        <template #option="{ option }">
          <span class="flex-shrink-0 h-3 w-3 rounded-full" :style="{ backgroundColor: `${option.hex}`}" />

          {{ option.text }}
        </template>
      </USelectMenu>
    </ClientOnly>

    <ClientOnly>
      <USelectMenu
        v-model="gray"
        name="gray"
        class="w-full [&>div>button]:!rounded-l-none [&>div>button]:-ml-px"
        color="gray"
        :ui="{ width: 'w-[194px]' }"
        :popper="{ placement: 'bottom-end' }"
        :options="grayOptions"
      >
        <template #label>
          <span class="flex-shrink-0 h-3 w-3 rounded-full" :style="{ backgroundColor: `${gray.hex}`}" />

          {{ gray.text }}
        </template>

        <template #option="{ option }">
          <span class="flex-shrink-0 h-3 w-3 rounded-full" :style="{ backgroundColor: `${option.hex}`}" />

          {{ option.text }}
        </template>
      </USelectMenu>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import colors from '#tailwind-config/theme/colors'

const appConfig = useAppConfig()
const colorMode = useColorMode()

const primaryCookie = useCookie('primary', { path: '/', default: () => appConfig.ui.primary })
const grayCookie = useCookie('gray', { path: '/', default: () => appConfig.ui.gray })

watch(primaryCookie, (primary) => {
  appConfig.ui.primary = primary
}, { immediate: true })

watch(grayCookie, (gray) => {
  appConfig.ui.gray = gray
}, { immediate: true })

// Computed

const primaryOptions = computed(() => useWithout(appConfig.ui.colors, 'primary').map(color => ({ value: color, text: color, hex: colors[color][colorMode.value === 'dark' ? 400 : 500] })))
const primary = computed({
  get () {
    return primaryOptions.value.find(option => option.value === primaryCookie.value)
  },
  set (option) {
    primaryCookie.value = option.value
  }
})

const grayOptions = computed(() => ['slate', 'cool', 'zinc', 'neutral', 'stone'].map(color => ({ value: color, text: color, hex: colors[color][colorMode.value === 'dark' ? 400 : 500] })))
const gray = computed({
  get () {
    return grayOptions.value.find(option => option.value === grayCookie.value)
  },
  set (option) {
    grayCookie.value = option.value
  }
})

// Hack for SSG
const hexToRgb = (hex) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function (_, r, g, b) {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : null
}
const root = computed(() => {
    return `:root {
${Object.entries(colors[primary.value.value] || colors.green).map(([key, value]) => `--color-primary-${key}: ${hexToRgb(value)};`).join('\n')}
${Object.entries(colors[gray.value.value] || colors.cool).map(([key, value]) => `--color-gray-${key}: ${hexToRgb(value)};`).join('\n')}
}`
  })
if (process.client) {
  watch(root, () => {
    window.localStorage.setItem('nuxt-ui-root', root.value)
  }, { immediate: true })
}
if (process.server) {
  useHead({
    script: [
      {
        innerHTML: `
            if (localStorage.getItem('nuxt-ui-root')) {
              document.querySelector('style#nuxt-ui-colors').innerHTML = localStorage.getItem('nuxt-ui-root')
            }`.replace(/\s+/g, ' '),
        type: 'text/javascript',
        tagPriority: -1
      }
    ]
  })
}
</script>
