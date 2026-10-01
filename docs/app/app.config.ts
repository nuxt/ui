import type { ColorAlias } from './utils/theme/engine/types'

// The palettes the theme picker and studio switch at runtime, written to CSS by `plugins/colors.ts`
declare module 'nuxt/schema' {
  interface AppConfigInput {
    colors?: Partial<Record<ColorAlias, string>>
  }
  interface CustomAppConfig {
    colors: Record<ColorAlias, string>
  }
}

export default defineAppConfig({
  colors: {
    primary: 'sky',
    secondary: 'violet',
    success: 'emerald',
    info: 'blue',
    warning: 'amber',
    error: 'red',
    neutral: 'gray'
  },
  toaster: {
    position: 'bottom-right' as const,
    duration: 5000,
    max: 5,
    expand: true
  }
})
