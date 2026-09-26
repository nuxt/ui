import { colorVariant } from './color'
// Shared with `checkbox-group` and `radio-group`, which style the same states on their own slots.
export const hover = 'hover:not-has-disabled:not-has-focus-visible:not-has-data-[state=checked]:'

// `list` puts focus on the control, which is the click target there. `card` and `table`
// render the root as a label wrapping everything, so focus belongs on the card itself,
// as it does whenever the control is `sr-only`.
export const focusControl = 'outline-accent-focus focus-visible:outline-solid focus-visible:outline-3 focus-visible:ring-accent'
export const focusCard = 'outline-accent-focus has-focus-visible:outline-3 not-has-disabled:has-focus-visible:border-accent has-focus-visible:z-[1]'

export default {
  slots: {
    root: 'relative flex items-start',
    container: 'flex items-center',
    base: 'rounded-sm ring ring-inset ring-accented overflow-hidden focus-visible:outline-none',
    indicator: 'flex items-center justify-center size-full text-accent-foreground bg-accent',
    icon: 'shrink-0',
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
        root: `border border-default rounded-lg ${hover}bg-elevated/50 transition-colors ${focusCard} has-data-[state=checked]:border-accent-border-strong has-data-[state=checked]:bg-accent-soft`
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
        wrapper: 'flex flex-col items-center gap-1 text-center'
      }
    },
    size: {
      xs: {
        base: 'size-3',
        icon: 'size-2.5',
        container: 'h-4',
        wrapper: 'text-xs'
      },
      sm: {
        base: 'size-3.5',
        icon: 'size-3',
        container: 'h-4',
        wrapper: 'text-xs'
      },
      md: {
        base: 'size-4',
        icon: 'size-3.5',
        container: 'h-5',
        wrapper: 'text-sm'
      },
      lg: {
        base: 'size-4.5',
        icon: 'size-4',
        container: 'h-5',
        wrapper: 'text-sm'
      },
      xl: {
        base: 'size-5',
        icon: 'size-4.5',
        container: 'h-6',
        wrapper: 'text-base'
      }
    },
    required: {
      true: {
        label: 'after:content-[\'*\'] after:ms-0.5 after:text-error'
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
        root: `${hover}border-accented`
      }
    },
    { size: 'xs', indicator: 'hidden', class: { icon: 'size-3' } },
    { size: 'sm', indicator: 'hidden', class: { icon: 'size-3.5' } },
    { size: 'md', indicator: 'hidden', class: { icon: 'size-4' } },
    { size: 'lg', indicator: 'hidden', class: { icon: 'size-4.5' } },
    { size: 'xl', indicator: 'hidden', class: { icon: 'size-5' } },
    { size: 'xs', variant: 'card', class: { root: 'p-2.5' } },
    { size: 'sm', variant: 'card', class: { root: 'p-3' } },
    { size: 'md', variant: 'card', class: { root: 'p-3.5' } },
    { size: 'lg', variant: 'card', class: { root: 'p-4' } },
    { size: 'xl', variant: 'card', class: { root: 'p-4.5' } },
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
}
