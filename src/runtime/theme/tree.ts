import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative isolate',
    item: 'w-full',
    listWithChildren: 'border-s border-default',
    itemWithChildren: 'ps-1.5 -ms-px',
    link: 'relative group w-full flex items-center text-sm select-none before:absolute before:inset-y-px before:inset-x-0 before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none focus-visible:before:outline-(length:--ui-focus-width) before:outline-accent-focus',
    linkLeadingIcon: 'shrink-0 relative',
    linkLabel: 'truncate',
    linkTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    linkTrailingIcon: 'shrink-0 transform transition-transform duration-200 ease-out motion-reduce:transition-none group-data-expanded:rotate-180'
  },
  variants: {
    virtualize: {
      true: {
        root: 'overflow-y-auto'
      }
    },
    color: colorVariant({ root: '' }),
    size: {
      xs: {
        root: '[--ui-control-px:var(--ui-control-px-xs)] [--ui-control-py:var(--ui-control-py-xs)] [--ui-control-gap:var(--ui-control-gap-xs)] [--ui-control-icon-size:var(--ui-control-icon-size-xs)]',
        listWithChildren: 'ms-4',
        link: 'px-(--ui-control-px) py-(--ui-control-py) text-xs gap-(--ui-control-gap)',
        linkLeadingIcon: 'size-(--ui-control-icon-size)',
        linkTrailingIcon: 'size-(--ui-control-icon-size)'
      },
      sm: {
        root: '[--ui-control-px:var(--ui-control-px-sm)] [--ui-control-py:var(--ui-control-py-sm)] [--ui-control-gap:var(--ui-control-gap-sm)] [--ui-control-icon-size:var(--ui-control-icon-size-sm)]',
        listWithChildren: 'ms-4.5',
        link: 'px-(--ui-control-px) py-(--ui-control-py) text-xs gap-(--ui-control-gap)',
        linkLeadingIcon: 'size-(--ui-control-icon-size)',
        linkTrailingIcon: 'size-(--ui-control-icon-size)'
      },
      md: {
        root: '[--ui-control-px:var(--ui-control-px-md)] [--ui-control-py:var(--ui-control-py-md)] [--ui-control-gap:var(--ui-control-gap-md)] [--ui-control-icon-size:var(--ui-control-icon-size-md)]',
        listWithChildren: 'ms-5',
        link: 'px-(--ui-control-px) py-(--ui-control-py) text-sm gap-(--ui-control-gap)',
        linkLeadingIcon: 'size-(--ui-control-icon-size)',
        linkTrailingIcon: 'size-(--ui-control-icon-size)'
      },
      lg: {
        root: '[--ui-control-px:var(--ui-control-px-lg)] [--ui-control-py:var(--ui-control-py-lg)] [--ui-control-gap:var(--ui-control-gap-lg)] [--ui-control-icon-size:var(--ui-control-icon-size-lg)]',
        listWithChildren: 'ms-5.5',
        link: 'px-(--ui-control-px) py-(--ui-control-py) text-sm gap-(--ui-control-gap)',
        linkLeadingIcon: 'size-(--ui-control-icon-size)',
        linkTrailingIcon: 'size-(--ui-control-icon-size)'
      },
      xl: {
        root: '[--ui-control-px:var(--ui-control-px-xl)] [--ui-control-py:var(--ui-control-py-xl)] [--ui-control-gap:var(--ui-control-gap-xl)] [--ui-control-icon-size:var(--ui-control-icon-size-xl)]',
        listWithChildren: 'ms-6',
        link: 'px-(--ui-control-px) py-(--ui-control-py) text-base gap-(--ui-control-gap)',
        linkLeadingIcon: 'size-(--ui-control-icon-size)',
        linkTrailingIcon: 'size-(--ui-control-icon-size)'
      }
    },
    selected: {
      true: {
        link: 'before:bg-soft text-accent'
      }
    },
    disabled: {
      true: {
        link: 'cursor-not-allowed opacity-(--ui-disabled-opacity)'
      }
    }
  },
  compoundVariants: [{
    selected: false,
    disabled: false,
    class: {
      link: 'hover:text-strong hover:before:bg-tint transition-colors before:transition-colors'
    }
  }],
  defaultVariants: {
    color: 'primary',
    size: 'md'
  }
})
