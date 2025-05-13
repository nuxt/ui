import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative',
    fieldset: 'flex gap-x-2',
    legend: 'mb-1 block font-medium text-default',
    item: ''
  },
  variants: {
    orientation: {
      horizontal: {
        fieldset: 'flex-row'
      },
      vertical: {
        fieldset: 'flex-col'
      }
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {}])),
      neutral: {}
    },
    variant: {
      list: {},
      card: {},
      table: {
        item: 'border border-muted'
      }
    },
    size: {
      xs: {
        fieldset: 'gap-y-0.5',
        legend: 'text-xs'
      },
      sm: {
        fieldset: 'gap-y-0.5',
        legend: 'text-xs'
      },
      md: {
        fieldset: 'gap-y-1',
        legend: 'text-sm'
      },
      lg: {
        fieldset: 'gap-y-1',
        legend: 'text-sm'
      },
      xl: {
        fieldset: 'gap-y-1.5',
        legend: 'text-base'
      }
    },
    required: {
      true: {
        legend: 'after:content-[\'*\'] after:ms-0.5 after:text-error'
      }
    }
  },
  compoundVariants: [
    { size: 'xs', variant: 'table', class: { item: 'p-2.5' } },
    { size: 'sm', variant: 'table', class: { item: 'p-3' } },
    { size: 'md', variant: 'table', class: { item: 'p-3.5' } },
    { size: 'lg', variant: 'table', class: { item: 'p-4' } },
    { size: 'xl', variant: 'table', class: { item: 'p-4.5' } },
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
      variant: 'table',
      class: {
        item: `has-data-[state=checked]:bg-${color}/10 has-data-[state=checked]:border-${color}/50 has-data-[state=checked]:z-[1]`
      }
    })),
    {
      color: 'neutral',
      variant: 'table',
      class: {
        item: 'has-data-[state=checked]:bg-elevated has-data-[state=checked]:border-inverted/50 has-data-[state=checked]:z-[1]'
      }
    },
    {
      variant: 'table',
      disabled: true,
      class: {
        item: 'cursor-not-allowed opacity-75'
      }
    }
  ],
  defaultVariants: {
    size: 'md',
    variant: 'list',
    color: 'primary'
  }
})
