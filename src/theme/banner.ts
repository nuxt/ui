import type { NuxtOptions } from '@nuxt/schema'

export default (options: Required<NuxtOptions['ui']>) => ({
  slots: {
    root: ['relative z-50 w-full', options.theme.transitions && 'transition-colors'],
    container: 'flex items-center justify-between gap-3 h-12',
    left: 'hidden lg:flex-1 lg:flex lg:items-center',
    center: 'flex items-center gap-1.5 min-w-0',
    right: 'lg:flex-1 flex items-center justify-end',
    icon: 'size-5 shrink-0 text-inverted pointer-events-none',
    title: 'text-sm text-inverted font-medium truncate',
    actions: 'flex gap-1.5 shrink-0 isolate',
    close: 'text-inverted hover:bg-default/10 focus-visible:bg-default/10 -me-1.5 lg:me-0'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        root: `bg-${color}`
      }])),
      neutral: {
        root: 'bg-inverted'
      }
    },
    to: {
      true: ''
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    to: true,
    class: {
      root: `hover:bg-${color}/90`
    }
  })), {
    color: 'neutral',
    to: true,
    class: {
      root: 'hover:bg-inverted/90'
    }
  }],
  defaultVariants: {
    color: 'primary'
  }
})
