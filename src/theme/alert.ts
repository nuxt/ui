import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative overflow-hidden w-full rounded-[calc(var(--ui-radius)*2)] p-4 flex gap-2.5',
    wrapper: 'min-w-0 flex-1 flex flex-col gap-1',
    title: 'text-sm font-medium',
    description: 'text-sm opacity-90',
    icon: 'shrink-0 size-5',
    avatar: 'shrink-0',
    avatarSize: '2xl',
    actions: 'flex gap-1.5 shrink-0',
    close: 'p-0.5'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    variant: {
      solid: '',
      outline: '',
      soft: '',
      subtle: ''
    },
    multiline: {
      true: {
        root: 'items-start',
        actions: 'items-start mt-1'
      },
      false: {
        root: 'items-center',
        actions: 'items-center'
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'solid',
    class: {
      root: `bg-[var(--ui-${color})] text-[var(--ui-bg)]`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'outline',
    class: {
      root: `text-[var(--ui-${color})] ring ring-inset ring-[var(--ui-${color})]/25`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'soft',
    class: {
      root: `bg-[var(--ui-${color})]/10 text-[var(--ui-${color})]`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'subtle',
    class: {
      root: `bg-[var(--ui-${color})]/10 text-[var(--ui-${color})] ring ring-inset ring-[var(--ui-${color})]/25`
    }
  })), {
    color: 'neutral',
    variant: 'solid',
    class: {
      root: 'text-[var(--ui-bg)] bg-[var(--ui-bg-inverted)]'
    }
  }, {
    color: 'neutral',
    variant: 'outline',
    class: {
      root: 'text-[var(--ui-text-highlighted)] bg-[var(--ui-bg)] ring ring-inset ring-[var(--ui-border)]'
    }
  }, {
    color: 'neutral',
    variant: 'soft',
    class: {
      root: 'text-[var(--ui-text-highlighted)] bg-[var(--ui-bg-elevated)]/50'
    }
  }, {
    color: 'neutral',
    variant: 'subtle',
    class: {
      root: 'text-[var(--ui-text-highlighted)] bg-[var(--ui-bg-elevated)]/50 ring ring-inset ring-[var(--ui-border-accented)]'
    }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'solid'
  }
})
