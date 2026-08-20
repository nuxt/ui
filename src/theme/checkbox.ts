import type { ModuleOptions } from '../module'

const hover = 'hover:not-has-disabled:not-has-focus-visible:not-has-data-[state=checked]:'

// `list` puts focus on the control, which is the click target there. `card` and `table`
// render the root as a label wrapping everything, so focus belongs on the card itself,
// as it does whenever the control is `sr-only`.
const focusControl = (token: string) => `outline-${token}/25 focus-visible:outline-solid focus-visible:outline-3 focus-visible:ring-${token}`
const focusCard = (token: string) => `outline-${token}/25 has-focus-visible:outline-3 not-has-disabled:has-focus-visible:border-${token}`

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative flex items-start',
    container: 'flex items-center',
    base: 'rounded-sm ring ring-inset ring-accented overflow-hidden focus-visible:outline-none',
    indicator: 'flex items-center justify-center size-full text-inverted',
    icon: 'shrink-0',
    wrapper: 'w-full',
    label: 'block font-medium text-default',
    description: 'text-muted'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        indicator: `bg-${color}`
      }])),
      neutral: {
        indicator: 'bg-inverted'
      }
    },
    variant: {
      list: {
        root: ''
      },
      card: {
        root: [`border border-muted rounded-lg ${hover}bg-elevated/50`, options.theme.transitions && 'transition-colors']
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
      true: '',
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
    ...[...(options.theme.colors || []).map((color: string) => [color, color]), ['neutral', 'inverted']].map(([color, token]: string[]) => ({
      color,
      variant: 'list',
      indicator: ['start', 'end'],
      class: {
        base: focusControl(token!)
      }
    })),
    ...[...(options.theme.colors || []).map((color: string) => [color, color]), ['neutral', 'inverted']].map(([color, token]: string[]) => ({
      color,
      variant: 'card',
      class: {
        root: focusCard(token!)
      }
    })),
    ...[...(options.theme.colors || []).map((color: string) => [color, color]), ['neutral', 'inverted']].map(([color, token]: string[]) => ({
      color,
      indicator: 'hidden',
      class: {
        root: focusCard(token!)
      }
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'card',
      class: {
        root: `has-data-[state=checked]:border-${color}/50 has-data-[state=checked]:bg-${color}/10`
      }
    })),
    {
      color: 'neutral',
      variant: 'card',
      class: {
        root: 'has-data-[state=checked]:border-inverted/50 has-data-[state=checked]:bg-elevated'
      }
    },
    {
      variant: 'card',
      disabled: true,
      class: {
        root: 'cursor-not-allowed'
      }
    },
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      indicator: 'hidden',
      highlight: true,
      class: {
        root: `not-has-disabled:border-${color} not-has-disabled:has-data-[state=checked]:border-${color}`
      }
    })),
    {
      color: 'neutral',
      indicator: 'hidden',
      highlight: true,
      class: {
        root: 'not-has-disabled:border-inverted not-has-disabled:has-data-[state=checked]:border-inverted'
      }
    },
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      highlight: true,
      class: {
        base: `ring-${color}`
      }
    })),
    {
      color: 'neutral',
      highlight: true,
      class: {
        base: 'ring-inverted'
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
