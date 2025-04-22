import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative group overflow-hidden bg-default shadow-lg rounded-lg ring ring-default p-4 flex gap-2.5 focus:outline-none',
    wrapper: 'w-0 flex-1 flex flex-col',
    title: 'text-sm font-medium text-highlighted',
    description: 'text-sm text-muted',
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
        root: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`,
        icon: `text-${color}`,
        progress: `bg-${color}`
      }])),
      neutral: {
        root: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted',
        icon: 'text-highlighted',
        progress: 'bg-inverted'
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
