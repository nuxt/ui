import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative',
    item: 'flex items-start',
    container: 'flex items-center',
    base: 'shrink-0 flex items-center justify-center rounded-sm text-inverted ring ring-inset ring-accented focus-visible:outline-2 focus-visible:outline-offset-2',
    indicator: 'flex items-center justify-center size-full rounded-sm after:bg-default',
    icon: 'shrink-0 size-full',
    wrapper: 'ms-2 w-full',
    label: 'block font-medium text-default',
    description: 'text-muted'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, `focus-visible:outline-${color}`])),
      neutral: 'focus-visible:outline-inverted'
    },
    variant: {
      list: {
      },
      card: {
        item: 'items-center border border-muted rounded-lg'
      },
      table: {
        item: 'border border-muted'
      }
    },
    orientation: {
      horizontal: {
        wrapper: 'me-2'
      },
      vertical: {
      }
    },
    indicator: {
      start: {
        item: 'flex-row',
        base: 'me-2'
      },
      end: {
        item: 'flex-row-reverse',
        base: 'ms-2'
      },
      hidden: {
        base: 'sr-only',
        wrapper: 'text-center'
      }
    },
    size: {
      xs: {
        base: 'size-3',
        item: 'text-xs',
        container: 'h-4',
        indicator: 'after:size-1'
      },
      sm: {
        base: 'size-3.5',
        item: 'text-xs',
        container: 'h-4',
        indicator: 'after:size-1'
      },
      md: {
        base: 'size-4',
        item: 'text-sm',
        container: 'h-5',
        indicator: 'after:size-1.5'
      },
      lg: {
        base: 'size-4.5',
        item: 'text-sm',
        container: 'h-5',
        indicator: 'after:size-1.5'
      },
      xl: {
        base: 'size-5',
        item: 'text-base',
        container: 'h-6',
        indicator: 'after:size-2'
      }
    },

    required: {
      true: {
        label: 'after:content-[\'*\'] after:ms-0.5 after:text-error'
      }
    },
    disabled: {
      true: {
        base: 'cursor-not-allowed opacity-75',
        label: 'cursor-not-allowed opacity-75',
        description: 'cursor-not-allowed opacity-75'
      }
    },
    checked: {
      true: ''
    }
  },
  compoundVariants: [
    { size: 'xs', variant: ['card', 'table'], class: { item: 'p-2.5' } },
    { size: 'sm', variant: ['card', 'table'], class: { item: 'p-3' } },
    { size: 'md', variant: ['card', 'table'], class: { item: 'p-3.5' } },
    { size: 'lg', variant: ['card', 'table'], class: { item: 'p-4' } },
    { size: 'xl', variant: ['card', 'table'], class: { item: 'p-4.5' } },
    {
      orientation: 'horizontal',
      variant: 'table',
      class: {
        item: 'first-of-type:rounded-l-lg last-of-type:rounded-r-lg'
      }
    },
    {
      orientation: 'vertical',
      variant: 'table',
      class: {
        item: 'first-of-type:rounded-t-lg last-of-type:rounded-b-lg'
      }
    },
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'card',
      class: {
        item: `has-data-[state=checked]:border-${color}`
      }
    })),
    {
      color: 'neutral',
      variant: 'card',
      class: {
        item: 'has-data-[state=checked]:border-elevated'
      }
    },
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'table',
      class: {
        item: `has-data-[state=checked]:bg-${color}/10 has-data-[state=checked]:border-${color}/50 has-data-[state=checked]:z-[1]`
      }
    })),
    {
      color: 'neutral',
      variant: 'table',
      class: {
        item: 'has-data-[state=checked]:bg-elevated has-data-[state=checked]:border-inverted/25 has-data-[state=checked]:z-[1]'
      }
    },
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      checked: true,
      class: `ring-2 ring-${color} bg-${color}`
    })), {
      color: 'neutral',
      checked: true,
      class: 'ring-2 ring-inverted bg-inverted'
    }
  ],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'list',
    indicator: 'start'
  }
})
