import type { NuxtOptions } from '@nuxt/schema'

export default (options: Required<NuxtOptions['ui']>) => ({
  slots: {
    base: ['group relative block my-5 p-4 sm:p-6 border border-default rounded-md bg-default', options.theme.transitions && 'transition-colors'],
    icon: 'size-6 mb-2 block',
    title: 'text-highlighted font-semibold',
    description: 'text-[15px] text-muted *:first:mt-0 *:last:mb-0 *:my-1',
    externalIcon: ['size-4 align-top absolute right-2 top-2 text-dimmed pointer-events-none', options.theme.transitions && 'transition-colors']
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        icon: `text-${color}`
      }])),
      neutral: {
        icon: 'text-highlighted'
      }
    },
    to: {
      true: ''
    },
    title: {
      true: {
        description: 'mt-1'
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    to: true,
    class: {
      base: `hover:bg-${color}/10 hover:border-${color}`,
      externalIcon: `group-hover:text-${color}`
    }
  })), {
    color: 'neutral',
    to: true,
    class: {
      base: 'hover:bg-elevated/50 hover:border-inverted',
      externalIcon: 'group-hover:text-highlighted'
    }
  }],
  defaultVariants: {
    color: 'primary'
  }
})
