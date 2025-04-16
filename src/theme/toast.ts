import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative group overflow-hidden bg-(--ui-bg) shadow-lg rounded-lg ring ring-(--ui-border) p-4 flex gap-2.5 focus:outline-none',
    wrapper: 'w-0 flex-1 flex flex-col',
    title: 'text-sm font-medium text-(--ui-text-highlighted)',
    description: 'text-sm text-(--ui-text-muted)',
    icon: 'shrink-0 size-5',
    avatar: 'shrink-0',
    avatarSize: '2xl',
    actions: 'flex gap-1.5 shrink-0',
    progress: 'absolute inset-x-0 bottom-0 h-1 z-[-1]',
    close: 'p-0'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        root: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ui-${color})`,
        icon: `text-(--ui-${color})`,
        progress: `bg-(--ui-${color})`
      }])),
      neutral: {
        root: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ui-border-inverted)',
        icon: 'text-(--ui-text-highlighted)',
        progress: 'bg-(--ui-bg-inverted)'
      }
    },
    orientation: {
      horizontal: {
        root: 'items-center',
        actions: 'items-center'
      },
      vertical: {
        root: 'items-start',
        actions: 'items-start mt-2.5'
      }
    },
    title: {
      true: {
        description: 'mt-1'
      }
    }
  },
  defaultVariants: {
    color: 'primary'
  }
})
