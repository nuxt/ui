import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative group overflow-hidden bg-default shadow-lg rounded-lg ring ring-default p-4 flex gap-2.5 outline-transparent focus-visible:outline-2',
    wrapper: 'w-0 flex-1 flex flex-col',
    title: 'text-sm font-medium text-highlighted',
    description: 'text-sm text-muted',
    icon: 'shrink-0 size-5',
    avatar: 'shrink-0',
    avatarSize: '2xl',
    actions: 'flex gap-1.5 shrink-0',
    progress: 'absolute inset-x-0 bottom-0',
    close: 'p-0'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        root: `focus-visible:outline-${color}/25 focus-visible:ring-inset focus-visible:ring-${color}/50`,
        icon: `text-${color}`
      }])),
      neutral: {
        root: 'focus-visible:outline-primary/25 focus-visible:ring-inset focus-visible:ring-primary/50',
        icon: 'text-highlighted'
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
