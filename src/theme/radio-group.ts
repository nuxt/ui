import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative',
    fieldset: 'flex',
    legend: 'mb-1 block font-medium text-(--ui-text)',
    item: 'flex items-start',
    base: 'rounded-full ring ring-inset ring-(--ui-border-accented) focus-visible:outline-2 focus-visible:outline-offset-2',
    indicator: 'flex items-center justify-center size-full rounded-full after:bg-(--ui-bg) after:rounded-full',
    container: 'flex items-center',
    wrapper: 'w-full',
    label: 'block font-medium text-(--ui-text)',
    description: 'text-(--ui-text-muted)'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        base: `focus-visible:outline-(--ui-${color})`,
        indicator: `bg-(--ui-${color})`
      }])),
      neutral: {
        base: 'focus-visible:outline-(--ui-border-inverted)',
        indicator: 'bg-(--ui-bg-inverted)'
      }
    },
    variant: {
      list: {
      },
      card: {
        item: 'items-center border border-(--ui-border-muted) rounded-lg'
      },
      table: {
        item: 'border border-(--ui-border-muted)'
      }
    },
    orientation: {
      horizontal: {
        fieldset: 'flex-row',
        wrapper: 'me-2'
      },
      vertical: {
        fieldset: 'flex-col'
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
        fieldset: 'gap-0.5',
        legend: 'text-xs',
        base: 'size-3',
        item: 'text-xs',
        container: 'h-4',
        indicator: 'after:size-1'
      },
      sm: {
        fieldset: 'gap-0.5',
        legend: 'text-xs',
        base: 'size-3.5',
        item: 'text-xs',
        container: 'h-4',
        indicator: 'after:size-1'
      },
      md: {
        fieldset: 'gap-1',
        legend: 'text-sm',
        base: 'size-4',
        item: 'text-sm',
        container: 'h-5',
        indicator: 'after:size-1.5'
      },
      lg: {
        fieldset: 'gap-1',
        legend: 'text-sm',
        base: 'size-4.5',
        item: 'text-sm',
        container: 'h-5',
        indicator: 'after:size-1.5'
      },
      xl: {
        fieldset: 'gap-1.5',
        legend: 'text-base',
        base: 'size-5',
        item: 'text-base',
        container: 'h-6',
        indicator: 'after:size-2'
      }
    },
    disabled: {
      true: {
        base: 'cursor-not-allowed opacity-75',
        label: 'cursor-not-allowed opacity-75'
      }
    },
    required: {
      true: {
        legend: 'after:content-[\'*\'] after:ms-0.5 after:text-(--ui-error)'
      }
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
        item: 'first-of-type:rounded-l-lg last-of-type:rounded-r-lg',
        fieldset: 'gap-0 -space-x-px'
      }
    },
    {
      orientation: 'vertical',
      variant: 'table',
      class: {
        item: 'first-of-type:rounded-t-lg last-of-type:rounded-b-lg',
        fieldset: 'gap-0 -space-y-px'
      }
    },
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'card',
      class: {
        item: `has-data-[state=checked]:border-(--ui-${color})`
      }
    })),
    {
      color: 'neutral',
      variant: 'card',
      class: {
        item: 'has-data-[state=checked]:border-(--ui-border-elevated)'
      }
    },
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'table',
      class: {
        item: `has-data-[state=checked]:bg-(--ui-${color})/10 has-data-[state=checked]:border-(--ui-${color})/50 has-data-[state=checked]:z-[1]`
      }
    })),
    {
      color: 'neutral',
      variant: 'table',
      class: {
        item: 'has-data-[state=checked]:bg-(--ui-bg-elevated) has-data-[state=checked]:border-(--ui-border-inverted)/25 has-data-[state=checked]:z-[1]'
      }
    }
  ],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'list',
    orientation: 'vertical',
    indicator: 'start'
  }
})
