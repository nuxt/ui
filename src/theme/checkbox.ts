import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative flex items-start',
    container: 'flex items-center',
    base: 'rounded-sm ring ring-inset ring-accented overflow-hidden focus-visible:outline-3',
    indicator: 'flex items-center justify-center size-full text-inverted',
    icon: 'shrink-0 size-full',
    wrapper: 'w-full',
    label: 'block font-medium text-default',
    leadingIcon: 'inline-block align-middle shrink-0 me-1.5',
    description: 'text-muted'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        base: `outline-${color}/25 focus-visible:ring-${color}`,
        indicator: `bg-${color}`
      }])),
      neutral: {
        base: 'outline-inverted/25 focus-visible:ring-inverted',
        indicator: 'bg-inverted'
      }
    },
    variant: {
      list: {
        root: ''
      },
      card: {
        root: 'border border-muted rounded-lg'
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
        wrapper: 'text-center'
      }
    },
    size: {
      xs: {
        base: 'size-3',
        container: 'h-4',
        wrapper: 'text-xs',
        leadingIcon: 'size-3'
      },
      sm: {
        base: 'size-3.5',
        container: 'h-4',
        wrapper: 'text-xs',
        leadingIcon: 'size-3.5'
      },
      md: {
        base: 'size-4',
        container: 'h-5',
        wrapper: 'text-sm',
        leadingIcon: 'size-4'
      },
      lg: {
        base: 'size-4.5',
        container: 'h-5',
        wrapper: 'text-sm',
        leadingIcon: 'size-4.5'
      },
      xl: {
        base: 'size-5',
        container: 'h-6',
        wrapper: 'text-base',
        leadingIcon: 'size-5'
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
      true: ''
    },
    checked: {
      true: ''
    }
  },
  compoundVariants: [
    { size: 'xs', variant: 'card', class: { root: 'p-2.5' } },
    { size: 'sm', variant: 'card', class: { root: 'p-3' } },
    { size: 'md', variant: 'card', class: { root: 'p-3.5' } },
    { size: 'lg', variant: 'card', class: { root: 'p-4' } },
    { size: 'xl', variant: 'card', class: { root: 'p-4.5' } },
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'card',
      class: {
        root: `has-data-[state=checked]:border-${color}`
      }
    })),
    {
      color: 'neutral',
      variant: 'card',
      class: {
        root: 'has-data-[state=checked]:border-inverted'
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
    size: 'md',
    color: 'primary',
    variant: 'list',
    indicator: 'start'
  }
})
