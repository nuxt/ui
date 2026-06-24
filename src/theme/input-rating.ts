import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    star: ['relative inline-block cursor-pointer select-none rounded-sm has-focus-visible:outline-3', options.theme.transitions && 'transition'],
    indicator: 'absolute inset-0 overflow-hidden outline-none w-(--reka-rating-item-step-width) opacity-(--reka-rating-item-step-opacity) z-(--reka-rating-item-step-z-index)',
    icon: 'block',
    emptyIcon: 'block w-full h-full text-muted pointer-events-none'
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'inline-flex items-center gap-0.5'
      },
      vertical: {
        root: 'inline-flex flex-col items-center gap-0.5'
      }
    },
    size: {
      xs: {
        star: 'size-3',
        icon: 'size-3'
      },
      sm: {
        star: 'size-4',
        icon: 'size-4'
      },
      md: {
        star: 'size-5',
        icon: 'size-5'
      },
      lg: {
        star: 'size-6',
        icon: 'size-6'
      },
      xl: {
        star: 'size-7',
        icon: 'size-7'
      }
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        indicator: `data-[state=active]:text-${color}`,
        star: `outline-${color}/25`
      }])),
      neutral: {
        indicator: 'data-[state=active]:text-highlighted',
        star: 'outline-inverted/25'
      }
    },
    readonly: {
      true: {
        root: 'cursor-default',
        star: 'cursor-default'
      },
      false: {}
    },
    disabled: {
      true: {
        root: 'opacity-75 cursor-not-allowed',
        star: 'cursor-not-allowed pointer-events-none'
      },
      false: {}
    }
  },
  compoundVariants: [{
    readonly: false,
    disabled: false,
    class: {
      star: 'hover:scale-110'
    }
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary'
  }
})
