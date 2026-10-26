import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'group/attachment relative flex items-center gap-2 shrink-0 h-14 rounded-md ring ring-default bg-elevated/50 overflow-hidden',
    image: 'size-full object-cover',
    overlay: 'absolute inset-0 flex items-center justify-center bg-default/60',
    icon: 'shrink-0 size-5 text-muted',
    name: 'min-w-0 truncate text-sm text-default',
    remove: ['absolute top-1 end-1 inline-flex items-center justify-center rounded-full p-0.5 bg-inverted/75 text-inverted hover:bg-inverted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inverted [@media(hover:hover)]:opacity-0 group-hover/attachment:opacity-100 focus-visible:opacity-100', options.theme.transitions && 'transition-[opacity,background-color] ease-out'],
    removeIcon: 'size-3'
  },
  variants: {
    image: {
      true: {
        root: 'w-14'
      },
      false: {
        root: 'max-w-56 px-3 has-data-[slot=remove]:pe-7'
      }
    },
    status: {
      idle: '',
      uploading: {
        icon: 'animate-spin'
      },
      error: {
        root: 'ring-error',
        icon: 'text-error'
      }
    }
  },
  defaultVariants: {
    status: 'idle'
  }
})
