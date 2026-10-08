import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative isolate',
    item: 'w-full',
    listWithChildren: 'border-s border-default',
    itemWithChildren: 'ps-1.5 -ms-px',
    link: 'relative group w-full flex items-center text-sm select-none before:absolute before:inset-y-px before:inset-x-0 before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none focus-visible:before:outline-3 before:outline-accent-focus',
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
        listWithChildren: 'ms-4',
        link: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-xs',
        linkLeadingIcon: 'size-(--ui-control-icon)',
        linkTrailingIcon: 'size-(--ui-control-icon)'
      },
      sm: {
        listWithChildren: 'ms-4.5',
        link: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-xs',
        linkLeadingIcon: 'size-(--ui-control-icon)',
        linkTrailingIcon: 'size-(--ui-control-icon)'
      },
      md: {
        listWithChildren: 'ms-5',
        link: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-sm',
        linkLeadingIcon: 'size-(--ui-control-icon)',
        linkTrailingIcon: 'size-(--ui-control-icon)'
      },
      lg: {
        listWithChildren: 'ms-5.5',
        link: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-sm',
        linkLeadingIcon: 'size-(--ui-control-icon)',
        linkTrailingIcon: 'size-(--ui-control-icon)'
      },
      xl: {
        listWithChildren: 'ms-6',
        link: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base',
        linkLeadingIcon: 'size-(--ui-control-icon)',
        linkTrailingIcon: 'size-(--ui-control-icon)'
      }
    },
    selected: {
      true: {
        link: 'before:bg-soft text-accent'
      }
    },
    disabled: {
      true: {
        link: 'cursor-not-allowed opacity-75'
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
