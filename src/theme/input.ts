import type { ModuleOptions } from '../module'
import { buttonGroupVariantWithRoot } from './button-group'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative inline-flex items-center',
    base: ['w-full rounded-[calc(var(--ui-radius)*1.5)] border-0 placeholder-[var(--ui-text-dimmed)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-75', options.theme.transitions && 'transition-colors'],
    leading: 'absolute inset-y-0 start-0 flex items-center',
    leadingIcon: 'shrink-0 text-[var(--ui-text-dimmed)]',
    leadingAvatar: 'shrink-0',
    trailing: 'absolute inset-y-0 end-0 flex items-center',
    trailingIcon: 'shrink-0 text-[var(--ui-text-dimmed)]'
  },
  variants: {
    ...buttonGroupVariantWithRoot,
    size: {
      xs: {
        base: 'px-2 py-1 text-xs gap-1',
        leading: 'pl-2',
        trailing: 'pr-2',
        leadingIcon: 'size-4',
        trailingIcon: 'size-4'
      },
      sm: {
        base: 'px-2.5 py-1.5 text-xs gap-1.5',
        leading: 'pl-2.5',
        trailing: 'pr-2.5',
        leadingIcon: 'size-4',
        trailingIcon: 'size-4'
      },
      md: {
        base: 'px-2.5 py-1.5 text-sm gap-1.5',
        leading: 'pl-2.5',
        trailing: 'pr-2.5',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5'
      },
      lg: {
        base: 'px-3 py-2 text-sm gap-2',
        leading: 'pl-3',
        trailing: 'pr-3',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5'
      },
      xl: {
        base: 'px-3 py-2 text-base gap-2',
        leading: 'pl-3',
        trailing: 'pr-3',
        leadingIcon: 'size-6',
        trailingIcon: 'size-6'
      }
    },
    variant: {
      outline: 'text-[var(--ui-text-highlighted)] bg-[var(--ui-bg)] ring ring-inset ring-[var(--ui-border-accented)]',
      soft: 'text-[var(--ui-text-highlighted)] bg-[var(--ui-bg-elevated)]/50 hover:bg-[var(--ui-bg-elevated)] focus:bg-[var(--ui-bg-elevated)] disabled:bg-[var(--ui-bg-elevated)]/50',
      subtle: 'text-[var(--ui-text-highlighted)] bg-[var(--ui-bg-elevated)] ring ring-inset ring-[var(--ui-border-accented)]',
      ghost: 'text-[var(--ui-text-highlighted)] hover:bg-[var(--ui-bg-elevated)] focus:bg-[var(--ui-bg-elevated)] disabled:bg-transparent dark:disabled:bg-transparent',
      none: 'text-[var(--ui-text-highlighted)]'
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    leading: {
      true: ''
    },
    trailing: {
      true: ''
    },
    loading: {
      true: ''
    },
    highlight: {
      true: ''
    },
    type: {
      file: 'file:mr-1.5 file:font-medium file:text-[var(--ui-text-muted)] file:outline-none'
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: ['outline', 'subtle'],
    class: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[--ui-${color}]`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    highlight: true,
    class: `ring ring-inset ring-[--ui-${color}]`
  })), {
    color: 'neutral',
    variant: ['outline', 'subtle'],
    class: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ui-border-inverted)]'
  }, {
    color: 'neutral',
    highlight: true,
    class: 'ring ring-inset ring-[var(--ui-border-inverted)]'
  }, {
    leading: true,
    size: 'xs',
    class: 'pl-7'
  }, {
    leading: true,
    size: 'sm',
    class: 'pl-8'
  }, {
    leading: true,
    size: 'md',
    class: 'pl-9'
  }, {
    leading: true,
    size: 'lg',
    class: 'pl-10'
  }, {
    leading: true,
    size: 'xl',
    class: 'pl-11'
  }, {
    trailing: true,
    size: 'xs',
    class: 'pr-7'
  }, {
    trailing: true,
    size: 'sm',
    class: 'pr-8'
  }, {
    trailing: true,
    size: 'md',
    class: 'pr-9'
  }, {
    trailing: true,
    size: 'lg',
    class: 'pr-10'
  }, {
    trailing: true,
    size: 'xl',
    class: 'pr-11'
  }, {
    loading: true,
    leading: true,
    class: {
      leadingIcon: 'animate-spin'
    }
  }, {
    loading: true,
    leading: false,
    trailing: true,
    class: {
      trailingIcon: 'animate-spin'
    }
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline'
  }
})
