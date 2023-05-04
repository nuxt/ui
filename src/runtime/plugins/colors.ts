import { computed } from 'vue'
import { defineNuxtPlugin, useHead, useAppConfig } from '#imports'
import colors from '#tailwind-config/theme/colors'

function hexToRgb (hex) {
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

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig()

  const root = computed(() => `:root {
${Object.entries(colors[appConfig.ui.primary]).map(([key, value]) => `--color-primary-${key}: ${hexToRgb(value)};`).join('\n')}

${Object.entries(colors[appConfig.ui.gray]).map(([key, value]) => `--color-gray-${key}: ${hexToRgb(value)};`).join('\n')}
  }`)

  // Head

  useHead({
    style: [{
      innerHTML: () => root.value
    }]
  })
})
