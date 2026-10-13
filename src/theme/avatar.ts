import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'inline-flex items-center justify-center shrink-0 select-none rounded-full align-middle',
    image: 'h-full w-full rounded-[inherit] object-cover',
    fallback: 'font-medium truncate',
    icon: 'shrink-0'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        root: `bg-${color}/10`,
        fallback: `text-${color}`,
        icon: `text-${color}`
      }])),
      neutral: {
        root: 'bg-elevated',
        fallback: 'text-muted',
        icon: 'text-muted'
      }
    },
    size: {
      '3xs': {
        root: 'size-4 text-[8px]'
      },
      '2xs': {
        root: 'size-5 text-[10px]'
      },
      'xs': {
        root: 'size-6 text-xs'
      },
      'sm': {
        root: 'size-7 text-sm'
      },
      'md': {
        root: 'size-8 text-base'
      },
      'lg': {
        root: 'size-9 text-lg'
      },
      'xl': {
        root: 'size-10 text-xl'
      },
      '2xl': {
        root: 'size-11 text-[22px]'
      },
      '3xl': {
        root: 'size-12 text-2xl'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'neutral'
  }
})
