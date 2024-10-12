import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative group overflow-hidden bg-[var(--ui-bg)] shadow-lg rounded-[calc(var(--ui-radius)*2)] ring ring-[var(--ui-border)] p-4 flex gap-2.5 focus:outline-none',
    wrapper: 'w-0 flex-1 flex flex-col gap-1',
    title: 'text-sm font-medium text-[var(--ui-text-highlighted)]',
    description: 'text-sm text-[var(--ui-text-muted)]',
    icon: 'shrink-0 size-5',
    avatar: 'shrink-0',
    avatarSize: '2xl',
    actions: 'flex gap-1.5 shrink-0',
    progress: 'absolute inset-x-0 bottom-0 h-1 z-[-1]',
    close: 'p-0.5'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        root: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ui-${color})]`,
        icon: `text-[var(--ui-${color})]`,
        progress: `bg-[var(--ui-${color})]`
      }])),
      neutral: {
        root: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ui-border-inverted)]',
        icon: 'text-[var(--ui-text-highlighted)]',
        progress: 'bg-[var(--ui-bg-inverted)]'
      }
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
  defaultVariants: {
    color: 'primary'
  }
})
