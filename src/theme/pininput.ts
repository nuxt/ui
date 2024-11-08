import type { ModuleOptions } from '../module'
import { buttonGroupVariantWithRoot } from './button-group'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex gap-2 items-center mt-1',
    base: ['w-10 h-10 rounded-[calc(var(--ui-radius)*1.5)] border-0 placeholder:text-[var(--ui-text-dimmed)] text-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75', options.theme.transitions && 'transition-colors']
  },
  variants: {
    ...buttonGroupVariantWithRoot,
    size: {
      '2xs': {
        base: 'h-6 w-6 text-xs'
      },
      'xs': {
        base: 'h-7 w-7 text-xs'
      },
      'sm': {
        base: 'h-8 w-8 text-xs'
      },
      'md': {
        base: 'h-9 w-9 text-sm'
      },
      'lg': {
        base: 'h-10 w-10 text-sm'
      },
      'xl': {
        base: 'h-11 w-11 text-base'
      },
      '2xl': {
        base: 'h-12 w-12 text-base'
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
    highlight: {
      true: ''
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: ['outline', 'subtle'],
    class: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ui-${color})]`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    highlight: true,
    class: `ring ring-inset ring-[var(--ui-${color})]`
  })), {
    color: 'neutral',
    variant: ['outline', 'subtle'],
    class: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ui-border-inverted)]'
  }, {
    color: 'neutral',
    highlight: true,
    class: 'ring ring-inset ring-[var(--ui-border-inverted)]'
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline'
  }
})
