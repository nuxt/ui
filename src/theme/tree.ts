import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative isolate',
    item: 'w-full',
    listWithChildren: 'border-s border-default',
    itemWithChildren: 'ps-1.5 -ms-px',
    link: 'relative group w-full flex items-center text-sm select-none before:absolute before:inset-y-px before:inset-x-0 before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2',
    linkLeadingIcon: 'shrink-0 relative',
    linkLabel: 'truncate',
    linkTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    linkTrailingIcon: 'shrink-0 transform transition-transform duration-200 group-data-expanded:rotate-180'
  },
  variants: {
    virtualize: {
      true: {
        root: 'overflow-y-auto'
      }
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        link: `focus-visible:before:ring-${color}`
      }])),
      neutral: {
        link: 'focus-visible:before:ring-inverted'
      }
    },
    size: {
      xs: {
        listWithChildren: 'ms-4',
        link: 'px-2 py-1 text-xs gap-1',
        linkLeadingIcon: 'size-4',
        linkTrailingIcon: 'size-4'
      },
      sm: {
        listWithChildren: 'ms-4.5',
        link: 'px-2.5 py-1.5 text-xs gap-1.5',
        linkLeadingIcon: 'size-4',
        linkTrailingIcon: 'size-4'
      },
      md: {
        listWithChildren: 'ms-5',
        link: 'px-2.5 py-1.5 text-sm gap-1.5',
        linkLeadingIcon: 'size-5',
        linkTrailingIcon: 'size-5'
      },
      lg: {
        listWithChildren: 'ms-5.5',
        link: 'px-3 py-2 text-sm gap-2',
        linkLeadingIcon: 'size-5',
        linkTrailingIcon: 'size-5'
      },
      xl: {
        listWithChildren: 'ms-6',
        link: 'px-3 py-2 text-base gap-2',
        linkLeadingIcon: 'size-6',
        linkTrailingIcon: 'size-6'
      }
    },
    selected: {
      true: {
        link: 'before:bg-elevated'
      }
    },
    disabled: {
      true: {
        link: 'cursor-not-allowed opacity-75'
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    selected: true,
    class: {
      link: `text-${color}`
    }
  })), {
    color: 'neutral',
    selected: true,
    class: {
      link: 'text-highlighted'
    }
  }, {
    selected: false,
    disabled: false,
    class: {
      link: ['hover:text-highlighted hover:before:bg-elevated/50', options.theme.transitions && 'transition-colors before:transition-colors']
    }
  }],
  defaultVariants: {
    color: 'primary',
    size: 'md'
  }
})
