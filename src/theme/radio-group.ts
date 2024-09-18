import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative',
    fieldset: 'flex',
    legend: 'mb-1 block font-medium text-gray-700 dark:text-gray-200',
    item: 'flex items-start',
    base: 'rounded-full ring ring-inset ring-gray-300 dark:ring-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-offset-white dark:focus-visible:outline-offset-gray-900',
    indicator: 'flex items-center justify-center size-full rounded-full after:bg-white dark:after:bg-gray-900 after:rounded-full',
    container: 'flex items-center',
    wrapper: 'ms-2',
    label: 'block font-medium text-gray-700 dark:text-gray-200',
    description: 'text-gray-500 dark:text-gray-400'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        base: `focus-visible:outline-${color}-500 dark:focus-visible:outline-${color}-400`,
        indicator: `bg-${color}-500 dark:bg-${color}-400`
      }])),
      gray: {
        base: 'focus-visible:outline-gray-900 dark:focus-visible:outline-white',
        indicator: 'bg-gray-900 dark:bg-white'
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
        legend: 'after:content-[\'*\'] after:ms-0.5 after:text-error-500 dark:after:text-error-400'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'primary'
  }
})
