import type { ModuleOptions } from '../module'
import { buttonGroupVariant } from './button-group'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    base: ['rounded-[calc(var(--ui-radius)*1.5)] font-medium inline-flex items-center focus:outline-none disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75', options.theme.transitions && 'transition-colors'],
    label: 'truncate',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    trailingIcon: 'shrink-0'
  },
  variants: {
    ...buttonGroupVariant,
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    variant: {
      solid: '',
      outline: '',
      soft: '',
      subtle: '',
      ghost: '',
      link: ''
    },
    size: {
      xs: {
        base: 'px-2 py-1 text-xs gap-1',
        leadingIcon: 'size-4',
        trailingIcon: 'size-4'
      },
      sm: {
        base: 'px-2.5 py-1.5 text-xs gap-1.5',
        leadingIcon: 'size-4',
        trailingIcon: 'size-4'
      },
      md: {
        base: 'px-2.5 py-1.5 text-sm gap-1.5',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5'
      },
      lg: {
        base: 'px-3 py-2 text-sm gap-2',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5'
      },
      xl: {
        base: 'px-3 py-2 text-base gap-2',
        leadingIcon: 'size-6',
        trailingIcon: 'size-6'
      }
    },
    block: {
      true: {
        base: 'w-full justify-center',
        trailingIcon: 'ms-auto'
      }
    },
    square: {
      true: ''
    },
    leading: {
      true: ''
    },
    trailing: {
      true: ''
    },
    loading: {
      true: ''
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'solid',
    class: `text-[var(--ui-bg)] bg-[--ui-${color}] hover:bg-[--ui-${color}]/75 disabled:bg-[--ui-${color}] aria-disabled:bg-[--ui-${color}] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--ui-${color}]`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'outline',
    class: `ring ring-inset ring-[--ui-${color}]/50 text-[--ui-${color}] hover:bg-[--ui-${color}]/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-[--ui-${color}]`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'soft',
    class: `text-[--ui-${color}] bg-[--ui-${color}]/10 hover:bg-[--ui-${color}]/15 focus-visible:bg-[--ui-${color}]/15 disabled:bg-[--ui-${color}]/10 aria-disabled:bg-[--ui-${color}]/10`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'subtle',
    class: `text-[--ui-${color}] ring ring-inset ring-[--ui-${color}]/25 bg-[--ui-${color}]/10 hover:bg-[--ui-${color}]/15 disabled:bg-[--ui-${color}]/10 aria-disabled:bg-[--ui-${color}]/10 focus-visible:ring-2 focus-visible:ring-[--ui-${color}]`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'ghost',
    class: `text-[--ui-${color}] hover:bg-[--ui-${color}]/10 focus-visible:bg-[--ui-${color}]/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'link',
    class: `text-[--ui-${color}] hover:text-[--ui-${color}] disabled:text-[--ui-${color}] aria-disabled:text-[--ui-${color}] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[--ui-${color}]`
  })), {
    color: 'neutral',
    variant: 'solid',
    class: 'text-[var(--ui-bg)] bg-[var(--ui-bg-inverted)] hover:bg-[var(--ui-bg-inverted)]/80 disabled:bg-[var(--ui-bg-inverted)] aria-disabled:bg-[var(--ui-bg-inverted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-border-inverted)]'
  }, {
    color: 'neutral',
    variant: 'outline',
    class: 'ring ring-inset ring-[var(--ui-border-accented)] text-[var(--ui-text)] bg-[var(--ui-bg)] hover:bg-[var(--ui-bg-elevated)] disabled:bg-[var(--ui-bg)] aria-disabled:bg-[var(--ui-bg)] focus-visible:ring-2 focus-visible:ring-[var(--ui-border-inverted)]'
  }, {
    color: 'neutral',
    variant: 'soft',
    class: 'text-[var(--ui-text)] bg-[var(--ui-bg-elevated)] hover:bg-[var(--ui-bg-accented)]/75 focus-visible:bg-[var(--ui-bg-accented)]/75 disabled:bg-[var(--ui-bg-elevated)] aria-disabled:bg-[var(--ui-bg-elevated)]'
  }, {
    color: 'neutral',
    variant: 'subtle',
    class: 'ring ring-inset ring-[var(--ui-border-accented)] text-[var(--ui-text)] bg-[var(--ui-bg-elevated)] hover:bg-[var(--ui-bg-accented)]/75 disabled:bg-[var(--ui-bg-elevated)] aria-disabled:bg-[var(--ui-bg-elevated)] focus-visible:ring-2 focus-visible:ring-[var(--ui-border-inverted)]'
  }, {
    color: 'neutral',
    variant: 'ghost',
    class: 'text-[var(--ui-text)] hover:bg-[var(--ui-bg-elevated)] focus-visible:bg-[var(--ui-bg-elevated)] hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent'
  }, {
    color: 'neutral',
    variant: 'link',
    class: 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text)] disabled:text-[var(--ui-text-muted)] aria-disabled:text-[var(--ui-text-muted)] focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-[var(--ui-border-inverted)]'
  }, {
    size: 'xs',
    square: true,
    class: 'p-1'
  }, {
    size: 'sm',
    square: true,
    class: 'p-1.5'
  }, {
    size: 'md',
    square: true,
    class: 'p-1.5'
  }, {
    size: 'lg',
    square: true,
    class: 'p-2'
  }, {
    size: 'xl',
    square: true,
    class: 'p-2'
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
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
})
