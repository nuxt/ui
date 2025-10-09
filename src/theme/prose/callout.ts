import type { NuxtOptions } from '@nuxt/schema'

export default (options: Required<NuxtOptions['ui']>) => ({
  slots: {
    base: ['group relative block px-4 py-3 rounded-md text-sm/6 my-5 last:mb-0 [&_code]:text-xs/5 [&_code]:bg-default [&_pre]:bg-default [&>div]:my-2.5 [&_ul]:my-2.5 [&_ol]:my-2.5 [&>*]:last:!mb-0 [&_ul]:ps-4.5 [&_ol]:ps-4.5 [&_li]:my-0', options.theme.transitions && 'transition-colors'],
    icon: ['size-4 shrink-0 align-sub me-1.5', options.theme.transitions && 'transition-colors'],
    externalIcon: ['size-4 align-top absolute right-2 top-2 pointer-events-none', options.theme.transitions && 'transition-colors']
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        base: `border border-${color}/25 bg-${color}/10 text-${color}-600 dark:text-${color}-300 [&_a]:text-${color} [&_a]:hover:border-${color} [&_code]:text-${color}-600 dark:[&_code]:text-${color}-300 [&_code]:border-${color}/25 [&_a]:hover:[&>code]:border-${color} [&_a]:hover:[&>code]:text-${color} [&>ul]:marker:text-${color}/50`,
        icon: `text-${color}`,
        externalIcon: `text-${color}-600 dark:text-${color}-300`
      }])),
      neutral: {
        base: 'border border-muted bg-muted text-default',
        icon: 'text-highlighted',
        externalIcon: 'text-dimmed'
      }
    },
    to: {
      true: 'border-dashed'
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    to: true,
    class: {
      base: `hover:border-${color}`,
      externalIcon: `group-hover:text-${color}`
    }
  })), {
    color: 'neutral',
    to: true,
    class: {
      base: 'hover:border-inverted',
      externalIcon: 'group-hover:text-highlighted'
    }
  }],
  defaultVariants: {
    color: 'neutral'
  }
})
