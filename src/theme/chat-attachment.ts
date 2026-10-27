import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'group/attachment relative inline-flex items-center shrink-0 rounded-lg',
    leading: 'flex items-center justify-center shrink-0 aspect-square rounded-md bg-elevated text-muted',
    leadingIcon: 'shrink-0',
    image: 'block aspect-square rounded-lg object-cover ring ring-default',
    overlay: 'absolute inset-0 flex items-center justify-center rounded-lg bg-default/50 backdrop-blur-xs',
    overlayIcon: 'shrink-0',
    wrapper: 'flex flex-col min-w-0 flex-1',
    name: 'block truncate font-medium text-highlighted',
    description: 'block truncate text-muted',
    remove: ['absolute -top-1.5 -end-1.5 z-1 inline-flex items-center justify-center size-5 rounded-full bg-inverted text-inverted ring-2 ring-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverted [@media(hover:hover)]:opacity-0 group-hover/attachment:opacity-100 group-focus-within/attachment:opacity-100', options.theme.transitions && 'transition-opacity ease-out'],
    removeIcon: 'size-3'
  },
  variants: {
    size: {
      xs: {
        root: 'gap-1.5 text-xs has-data-[slot=leading]:p-1 has-data-[slot=leading]:pe-2',
        leading: 'size-7',
        leadingIcon: 'size-3.5',
        image: 'size-10',
        overlayIcon: 'size-4',
        description: 'text-[10px]/3'
      },
      sm: {
        root: 'gap-2 text-xs has-data-[slot=leading]:p-1.5 has-data-[slot=leading]:pe-2.5',
        leading: 'size-8',
        leadingIcon: 'size-4',
        image: 'size-12',
        overlayIcon: 'size-5',
        description: 'text-xs/4'
      },
      md: {
        root: 'gap-2.5 text-sm has-data-[slot=leading]:p-2 has-data-[slot=leading]:pe-3',
        leading: 'size-10',
        leadingIcon: 'size-5',
        image: 'size-14',
        overlayIcon: 'size-6',
        description: 'mt-0.5 text-xs'
      }
    },
    image: {
      true: '',
      false: {
        root: 'min-w-0 max-w-full ring ring-default bg-default'
      }
    },
    status: {
      idle: '',
      uploading: {
        leadingIcon: 'animate-spin',
        overlayIcon: 'animate-spin text-default'
      },
      error: {
        root: 'ring-error/40',
        image: 'ring-error/40',
        leading: 'bg-error/10 text-error',
        overlayIcon: 'text-error',
        description: 'text-error'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    status: 'idle'
  }
})
