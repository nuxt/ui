import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative isolate inline-flex select-none',
    viewport: ['relative w-full overflow-hidden touch-none outline-none rounded-md bg-default ring ring-inset ring-accented focus-visible:ring-2', options.theme.transitions && 'transition-[color,box-shadow]'],
    list: 'absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_75%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_75%,transparent)]',
    item: ['absolute flex items-center justify-center gap-1.5 px-2 whitespace-nowrap will-change-transform text-dimmed cursor-default', options.theme.transitions && 'transition-colors'],
    itemLeading: 'shrink-0 flex items-center',
    itemLabel: 'truncate',
    indicator: 'absolute inset-x-1 top-1/2 -translate-y-1/2 pointer-events-none rounded-md',
    empty: 'absolute inset-0 flex items-center justify-center text-center text-muted'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        viewport: `focus-visible:ring-${color}`,
        item: `aria-selected:text-${color}`,
        indicator: `bg-${color}/10`
      }])),
      neutral: {
        viewport: 'focus-visible:ring-inverted',
        item: 'aria-selected:text-highlighted',
        indicator: 'bg-elevated'
      }
    },
    variant: {
      pill: {
        indicator: ''
      },
      line: {
        indicator: 'inset-x-0 rounded-none bg-transparent! border-y border-default'
      }
    },
    size: {
      xs: { item: 'text-xs', empty: 'text-xs' },
      sm: { item: 'text-sm', empty: 'text-sm' },
      md: { item: 'text-base', empty: 'text-sm' },
      lg: { item: 'text-lg', empty: 'text-base' },
      xl: { item: 'text-xl', empty: 'text-base' }
    },
    orientation: {
      vertical: {
        root: 'w-36',
        item: 'aria-selected:font-medium'
      },
      horizontal: {
        root: 'w-auto max-w-full',
        list: '[mask-image:linear-gradient(to_right,transparent,#000_25%,#000_75%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_25%,#000_75%,transparent)]',
        item: 'aria-selected:font-medium'
      }
    },
    disabled: {
      true: {
        root: 'opacity-75 cursor-not-allowed',
        viewport: 'pointer-events-none'
      }
    },
    bare: {
      true: {
        viewport: 'bg-transparent ring-0 rounded-none'
      }
    }
  },
  compoundVariants: [{
    orientation: 'horizontal',
    variant: 'pill',
    class: {
      indicator: 'inset-x-auto inset-y-1 start-1/2 top-auto translate-y-0 -translate-x-1/2 rtl:translate-x-1/2'
    }
  }, {
    orientation: 'horizontal',
    variant: 'line',
    class: {
      indicator: 'inset-x-auto inset-y-0 start-1/2 top-auto translate-y-0 -translate-x-1/2 rtl:translate-x-1/2 border-y-0 border-x border-default'
    }
  }],
  defaultVariants: {
    size: 'md',
    color: 'neutral',
    variant: 'pill'
  }
})
