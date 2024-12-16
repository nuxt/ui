import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative flex items-start',
    base: 'shrink-0 flex items-center justify-center rounded-[var(--ui-radius)] text-[var(--ui-bg)] ring ring-inset ring-[var(--ui-border-accented)] focus-visible:outline-2 focus-visible:outline-offset-2',
    container: 'flex items-center',
    wrapper: 'ms-2',
    icon: 'shrink-0 size-full',
    label: 'block font-medium text-[var(--ui-text)]',
    description: 'text-[var(--ui-text-muted)]'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, `focus-visible:outline-[var(--ui-${color})]`])),
      neutral: 'focus-visible:outline-[var(--ui-border-inverted)]'
    },
    size: {
      xs: {
        base: 'size-3',
        container: 'h-4',
        wrapper: 'text-xs'
      },
      sm: {
        base: 'size-3.5',
        container: 'h-4',
        wrapper: 'text-xs'
      },
      md: {
        base: 'size-4',
        container: 'h-5',
        wrapper: 'text-sm'
      },
      lg: {
        base: 'size-4.5',
        container: 'h-5',
        wrapper: 'text-sm'
      },
      xl: {
        base: 'size-5',
        container: 'h-6',
        wrapper: 'text-base'
      }
    },
    required: {
      true: {
        label: 'after:content-[\'*\'] after:ms-0.5 after:text-[var(--ui-error)]'
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
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    checked: true,
    class: `ring-2 ring-[var(--ui-${color})] bg-[var(--ui-${color})]`
  })), {
    color: 'neutral',
    checked: true,
    class: 'ring-2 ring-[var(--ui-border-inverted)] bg-[var(--ui-bg-inverted)]'
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary'
  }
})
