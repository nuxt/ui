import type { NuxtOptions } from '@nuxt/schema'

export default (options: Required<NuxtOptions['ui']>) => ({
  base: 'px-1.5 py-0.5 text-sm font-mono font-medium rounded-md inline-block',
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, `border border-${color}/25 bg-${color}/10 text-${color}`])),
      neutral: 'border border-muted text-highlighted bg-muted'
    }
  },
  defaultVariants: {
    color: 'neutral'
  }
})
