import type { ModuleOptions } from '../module'
import { focusCard, focusControl, hover } from './checkbox'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative',
    fieldset: 'flex gap-x-2',
    legend: 'mb-1 block font-medium text-default',
    item: 'flex items-start',
    container: 'flex items-center',
    base: 'rounded-full ring ring-inset ring-accented overflow-hidden focus-visible:outline-none',
    indicator: 'flex items-center justify-center size-full after:bg-default after:rounded-full',
    wrapper: 'w-full',
    label: 'block font-medium text-default',
    icon: 'shrink-0',
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
        fieldset: 'flex-wrap',
        item: ''
      },
      card: {
        fieldset: 'flex-wrap',
        item: [`border border-default rounded-lg ${hover}bg-elevated/50`, options.theme.transitions && 'transition-colors']
      },
      table: {
        item: [`border border-default ${hover}bg-elevated/50`, options.theme.transitions && 'transition-colors']
      }
    },
    orientation: {
      horizontal: {
        fieldset: 'flex-row'
      },
      vertical: {
        fieldset: 'flex-col'
      }
    },
    indicator: {
      start: {
        item: 'flex-row',
        wrapper: 'ms-2'
      },
      end: {
        item: 'flex-row-reverse',
        wrapper: 'me-2'
      },
      hidden: {
        base: 'sr-only',
        wrapper: 'flex flex-col items-center gap-1 text-center'
      }
    },
    size: {
      xs: {
        fieldset: 'gap-y-0.5',
        legend: 'text-xs',
        base: 'size-3',
        item: 'text-xs',
        container: 'h-4',
        indicator: 'after:size-1'
      },
      sm: {
        fieldset: 'gap-y-0.5',
        legend: 'text-xs',
        base: 'size-3.5',
        item: 'text-xs',
        container: 'h-4',
        indicator: 'after:size-1'
      },
      md: {
        fieldset: 'gap-y-1',
        legend: 'text-sm',
        base: 'size-4',
        item: 'text-sm',
        container: 'h-5',
        indicator: 'after:size-1.5'
      },
      lg: {
        fieldset: 'gap-y-1',
        legend: 'text-sm',
        base: 'size-4.5',
        item: 'text-sm',
        container: 'h-5',
        indicator: 'after:size-1.5'
      },
      xl: {
        fieldset: 'gap-y-1.5',
        legend: 'text-base',
        base: 'size-5',
        item: 'text-base',
        container: 'h-6',
        indicator: 'after:size-2'
      }
    },
    highlight: {
      true: '',
      false: ''
    },
    disabled: {
      true: {
        item: 'opacity-75',
        base: 'cursor-not-allowed',
        label: 'cursor-not-allowed',
        description: 'cursor-not-allowed'
      }
    },
    required: {
      true: {
        legend: 'after:content-[\'*\'] after:ms-0.5 after:text-error'
      }
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
      variant: ['card', 'table'],
      highlight: false,
      class: {
        item: `${hover}border-accented`
      }
    },
    { size: 'xs', indicator: 'hidden', class: { icon: 'size-3' } },
    { size: 'sm', indicator: 'hidden', class: { icon: 'size-3.5' } },
    { size: 'md', indicator: 'hidden', class: { icon: 'size-4' } },
    { size: 'lg', indicator: 'hidden', class: { icon: 'size-4.5' } },
    { size: 'xl', indicator: 'hidden', class: { icon: 'size-5' } },
    { size: 'xs', variant: ['card', 'table'], class: { item: 'p-2.5' } },
    { size: 'sm', variant: ['card', 'table'], class: { item: 'p-3' } },
    { size: 'md', variant: ['card', 'table'], class: { item: 'p-3.5' } },
    { size: 'lg', variant: ['card', 'table'], class: { item: 'p-4' } },
    { size: 'xl', variant: ['card', 'table'], class: { item: 'p-4.5' } },
    {
      orientation: 'horizontal',
      variant: 'table',
      class: {
        item: 'first-of-type:rounded-s-lg last-of-type:rounded-e-lg',
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
      variant: ['card', 'table'],
      class: {
        item: focusCard(token!)
      }
    })),
    ...[...(options.theme.colors || []).map((color: string) => [color, color]), ['neutral', 'inverted']].map(([color, token]: string[]) => ({
      color,
      variant: 'list',
      indicator: 'hidden',
      class: {
        item: focusCard(token!)
      }
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'card',
      class: {
        item: `has-data-[state=checked]:border-${color}/50 has-data-[state=checked]:bg-${color}/10`
      }
    })),
    {
      color: 'neutral',
      variant: 'card',
      class: {
        item: 'has-data-[state=checked]:border-inverted/50 has-data-[state=checked]:bg-elevated'
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
      variant: ['card', 'table'],
      disabled: true,
      class: {
        item: 'cursor-not-allowed'
      }
    },
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      indicator: 'hidden',
      highlight: true,
      class: {
        item: `not-has-disabled:border-${color} not-has-disabled:has-data-[state=checked]:border-${color}`
      }
    })),
    {
      color: 'neutral',
      indicator: 'hidden',
      highlight: true,
      class: {
        item: 'not-has-disabled:border-inverted not-has-disabled:has-data-[state=checked]:border-inverted'
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
