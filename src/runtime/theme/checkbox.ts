import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

// `list` puts focus on the control, which is the click target there. `card` and `table`
// render the root as a label wrapping everything, so focus belongs on the card itself,
// as it does whenever the control is `sr-only`.
export const focusControl = 'outline-accent-focus focus-visible:outline-solid focus-visible:outline-3 focus-visible:ring-accent'
export const focusCard = 'outline-accent-focus has-focus-visible:outline-3 not-has-disabled:has-focus-visible:border-accent has-focus-visible:z-[1]'

export default defineTheme({
  slots: {
    root: 'relative flex items-start',
    container: 'flex items-center',
    base: 'rounded-sm ring ring-inset ring-strong overflow-hidden focus-visible:outline-none',
    indicator: 'flex items-center justify-center size-full text-accent-contrast bg-accent',
    icon: 'shrink-0 size-(--ui-control-icon)',
    wrapper: 'w-full',
    label: 'block font-medium text-default',
    description: 'text-muted'
  },
  variants: {
    color: colorVariant({ root: '' }),
    variant: {
      list: {
        root: ''
      },
      card: {
        root: `px-(--ui-control-px) py-(--ui-control-py) border border-default rounded-lg hover:not-has-disabled:not-has-focus-visible:not-has-data-[state=checked]:bg-tint transition-colors ${focusCard} has-data-[state=checked]:border-accent/50 has-data-[state=checked]:bg-accent-soft`
      }
    },
    indicator: {
      start: {
        root: 'flex-row',
        wrapper: 'ms-2'
      },
      end: {
        root: 'flex-row-reverse',
        wrapper: 'me-2'
      },
      hidden: {
        base: 'sr-only',
        icon: 'size-[calc(var(--ui-control-icon)+--spacing(0.5))]',
        wrapper: 'flex flex-col items-center gap-1 text-center'
      }
    },
    size: {
      xs: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(2.5)] [--ui-control-icon:--spacing(2.5)]',
        base: 'size-3',
        container: 'h-4',
        wrapper: 'text-xs'
      },
      sm: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(3)] [--ui-control-icon:--spacing(3)]',
        base: 'size-3.5',
        container: 'h-4',
        wrapper: 'text-xs'
      },
      md: {
        root: '[--ui-control-px:--spacing(3.5)] [--ui-control-py:--spacing(3.5)] [--ui-control-icon:--spacing(3.5)]',
        base: 'size-4',
        container: 'h-5',
        wrapper: 'text-sm'
      },
      lg: {
        root: '[--ui-control-px:--spacing(4)] [--ui-control-py:--spacing(4)] [--ui-control-icon:--spacing(4)]',
        base: 'size-4.5',
        container: 'h-5',
        wrapper: 'text-sm'
      },
      xl: {
        root: '[--ui-control-px:--spacing(4.5)] [--ui-control-py:--spacing(4.5)] [--ui-control-icon:--spacing(4.5)]',
        base: 'size-5',
        container: 'h-6',
        wrapper: 'text-base'
      }
    },
    required: {
      true: {
        label: `after:content-['*'] after:ms-0.5 after:text-error`
      }
    },
    disabled: {
      true: {
        root: 'opacity-75',
        base: 'cursor-not-allowed',
        label: 'cursor-not-allowed',
        description: 'cursor-not-allowed'
      }
    },
    highlight: {
      true: {
        base: 'ring-accent'
      },
      false: ''
    },
    checked: {
      true: ''
    }
  },
  compoundVariants: [
    {
      indicator: 'hidden',
      class: {
        container: 'h-auto'
      }
    },
    {
      variant: 'card',
      highlight: false,
      class: {
        root: 'hover:not-has-disabled:not-has-focus-visible:not-has-data-[state=checked]:border-strong'
      }
    },
    {
      variant: 'list',
      indicator: ['start', 'end'],
      class: {
        base: focusControl
      }
    },
    {
      variant: 'list',
      indicator: 'hidden',
      class: {
        root: focusCard
      }
    },
    {
      variant: 'card',
      disabled: true,
      class: {
        root: 'cursor-not-allowed'
      }
    },
    {
      indicator: 'hidden',
      highlight: true,
      class: {
        root: 'not-has-disabled:border-accent not-has-disabled:has-data-[state=checked]:border-accent'
      }
    }
  ],
  defaultVariants: {
    highlight: false,
    size: 'md',
    color: 'primary',
    variant: 'list',
    indicator: 'start'
  }
})
