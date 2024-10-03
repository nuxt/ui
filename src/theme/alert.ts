import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative overflow-hidden w-full rounded-lg p-4 flex gap-2.5',
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
      gray: ''
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
      root: `bg-${color}-500 dark:bg-${color}-400 text-[--ui-bg]`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'outline',
    class: {
      root: `text-${color}-500 dark:text-${color}-400 ring ring-inset ring-${color}-500/25 dark:ring-${color}-400/25`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'soft',
    class: {
      root: `bg-${color}-500/10 dark:bg-${color}-400/10 text-${color}-500 dark:text-${color}-400`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'subtle',
    class: {
      root: `bg-${color}-500/10 dark:bg-${color}-400/10 text-${color}-500 dark:text-${color}-400 ring ring-inset ring-${color}-500/25 dark:ring-${color}-400/25`
    }
  })), {
    color: 'gray',
    variant: 'solid',
    class: {
      root: 'text-[--ui-bg] bg-[--ui-bg-inverted]'
    }
  }, {
    color: 'gray',
    variant: 'outline',
    class: {
      root: 'text-[--ui-text-highlighted] bg-[--ui-bg] ring ring-inset ring-[--ui-border]'
    }
  }, {
    color: 'gray',
    variant: 'soft',
    class: {
      root: 'text-[--ui-text-highlighted] bg-[--ui-bg-elevated]/50'
    }
  }, {
    color: 'gray',
    variant: 'subtle',
    class: {
      root: 'text-[--ui-text-highlighted] bg-[--ui-bg-elevated]/50 ring ring-inset ring-[--ui-border-accented]'
    }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'outline'
  }
})
