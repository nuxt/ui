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
    itemWrapper: 'flex',
    wrapper: '',
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
        itemWrapper: 'gap-2',
        item: 'items-center justify-between border-1 border-[var(--ui-border-muted)] rounded-lg'
      },
      table: {
        item: 'border-[var(--ui-border-muted)]'
      }
    },
    orientation: {
      horizontal: {
        itemWrapper: 'flex-row'
      },
      vertical: {
        itemWrapper: 'flex-col'
      }
    },

    indicator: {
      left: {
        item: 'flex-row',
        base: 'me-2'
      },
      right: {
        item: 'flex-row-reverse',
        base: 'ms-2'
      },

      hidden: {
        base: 'hidden'
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
    { size: 'xs', variant: 'card', class: { item: 'p-2.5' } },
    { size: 'sm', variant: 'card', class: { item: 'p-3' } },
    { size: 'md', variant: 'card', class: { item: 'p-3.5' } },
    { size: 'lg', variant: 'card', class: { item: 'p-4' } },
    { size: 'xl', variant: 'card', class: { item: 'p-4.5' } },

    { size: 'xs', variant: 'table', class: { item: 'p-2.5' } },
    { size: 'sm', variant: 'table', class: { item: 'p-3' } },
    { size: 'md', variant: 'table', class: { item: 'p-3.5' } },
    { size: 'lg', variant: 'table', class: { item: 'p-4' } },
    { size: 'xl', variant: 'table', class: { item: 'p-4.5' } },

    { orientation: 'horizontal', variant: 'list', class: { item: 'me-2' } },
    { orientation: 'horizontal', variant: 'table', class: { item: 'first:rounded-l-lg last:rounded-r-lg not-last:-ml-0.25 border-1' } },
    { orientation: 'vertical', variant: 'table', class: { item: 'first:rounded-t-lg last:rounded-b-lg not-last:-mb-0.25 border-1' } },
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'card',
      class: {
        item: `has-data-[state=checked]:border-[var(--ui-${color})]`
      }
    })),

    {
      color: 'neutral',
      variant: 'card',
      class: {
        item: 'has-data-[state=checked]:border-[var(--ui-border-elevated)]'
      }
    },

    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'table',
      class: {
        item: `has-data-[state=checked]:relative has-data-[state=checked]:bg-[var(--ui-${color})]/20 has-data-[state=checked]:border-[var(--ui-${color})]/20`
      }
    }))
  ],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'list',
    orientation: 'vertical',
    indicator: 'left'
  }
})
