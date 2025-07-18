import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative',
    base: ['w-full bg-default hover:bg-elevated/25 border border-default p-4 flex flex-col items-center justify-center rounded-lg focus-visible:outline-primary', options.theme.transitions && 'transition-colors'],
    wrapper: 'flex flex-col items-center justify-center text-center px-4 py-3',
    leading: 'inline-flex items-center rounded-full ring ring-default',
    leadingIcon: 'shrink-0 text-default',
    label: 'font-medium text-default mt-2',
    description: 'text-muted mt-1',
    actions: 'flex flex-wrap gap-1.5 shrink-0',
    preview: 'absolute inset-0'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    size: {
      xs: {
        base: 'text-xs',
        leading: 'p-1',
        leadingIcon: 'size-4'
      },
      sm: {
        base: 'text-xs',
        leading: 'p-1.5',
        leadingIcon: 'size-4'
      },
      md: {
        base: 'text-sm',
        leading: 'p-1.5',
        leadingIcon: 'size-5'
      },
      lg: {
        base: 'text-sm',
        leading: 'p-2',
        leadingIcon: 'size-5'
      },
      xl: {
        base: 'text-base',
        leading: 'p-2',
        leadingIcon: 'size-6'
      }
    },
    dropzone: {
      true: 'border-dashed data-[dragging=true]:bg-elevated/25'
    },
    disabled: {
      true: 'cursor-not-allowed opacity-75'
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    class: `has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-${color}`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    highlight: true,
    class: `ring ring-inset ring-${color}`
  })), {
    color: 'neutral',
    class: 'has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-inverted'
  }, {
    color: 'neutral',
    highlight: true,
    class: 'ring ring-inset ring-inverted'
  }],
  defaultVariants: {
    size: 'md'
  }
})
