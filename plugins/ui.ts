import { defineNuxtPlugin } from '#app'
import { computed, useTheme } from '#imports'
import type { ThemeOptions } from '#theme/types'

export default defineNuxtPlugin(() => {
  const theme = useTheme()

  const ui = computed(() => {
    return theme.value.ui
  })

  return {
    provide: {
      ui
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $ui: ThemeOptions['ui']
  }
}
