import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative isolate',
    item: '',
    listWithChildren: 'ms-4.5 border-s border-(--ui-border)',
    itemWithChildren: 'ps-1.5 -ms-px',
    link: 'relative group w-full flex items-center text-sm before:absolute before:inset-y-px before:inset-x-0 before:z-[-1] before:rounded-[calc(var(--ui-radius)*1.5)] focus:outline-none focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2',
    linkLeadingIcon: 'shrink-0',
    linkLabel: 'truncate',
    linkTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    linkTrailingIcon: 'shrink-0 transform transition-transform duration-200 group-data-expanded:rotate-180'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        link: `focus-visible:before:ring-(--ui-${color})`
      }])),
      neutral: {
        link: 'focus-visible:before:ring-(--ui-border-inverted)'
      }
    },
    size: {
      xs: {
        link: 'px-2 py-1 text-xs gap-1',
        linkLeadingIcon: 'size-4',
        linkTrailingIcon: 'size-4'
      },
      sm: {
        link: 'px-2.5 py-1.5 text-xs gap-1.5',
        linkLeadingIcon: 'size-4',
        linkTrailingIcon: 'size-4'
      },
      md: {
        link: 'px-2.5 py-1.5 text-sm gap-1.5',
        linkLeadingIcon: 'size-5',
        linkTrailingIcon: 'size-5'
      },
      lg: {
        link: 'px-3 py-2 text-sm gap-2',
        linkLeadingIcon: 'size-5',
        linkTrailingIcon: 'size-5'
      },
      xl: {
        link: 'px-3 py-2 text-base gap-2',
        linkLeadingIcon: 'size-6',
        linkTrailingIcon: 'size-6'
      }
    },
    selected: {
      true: {
        link: 'before:bg-(--ui-bg-elevated)'
      },
      false: {
        link: ['hover:not-disabled:text-(--ui-text-highlighted) hover:not-disabled:before:bg-(--ui-bg-elevated)/50', options.theme.transitions && 'transition-colors before:transition-colors']
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
      link: `text-(--ui-${color})`
    }
  })), {
    color: 'neutral',
    selected: true,
    class: {
      link: 'text-(--ui-text-highlighted)'
    }
  }],
  defaultVariants: {
    color: 'primary',
    size: 'md'
  }
})
