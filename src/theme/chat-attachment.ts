import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'group/attachment relative flex min-w-0 max-w-full w-fit shrink-0',
    leading: 'relative flex items-center justify-center shrink-0 aspect-square overflow-hidden rounded-lg bg-elevated text-muted',
    leadingIcon: 'absolute shrink-0',
    image: 'size-full object-cover',
    wrapper: 'grid grid-cols-[minmax(0,1fr)_auto] items-center min-w-0 flex-1',
    name: 'block truncate font-medium text-highlighted',
    description: 'block truncate row-start-2 text-xs text-muted',
    remove: 'shrink-0'
  },
  variants: {
    size: {
      xs: {
        root: 'gap-1.5 p-1 rounded-lg text-xs data-[orientation=vertical]:w-20 data-[variant=thumbnail]:w-10',
        leading: 'w-7 rounded-md',
        leadingIcon: 'size-3.5',
        description: 'text-[10px]/3'
      },
      sm: {
        root: 'gap-2 p-1.5 text-xs data-[orientation=vertical]:w-24 data-[variant=thumbnail]:w-12',
        leading: 'w-8',
        leadingIcon: 'size-4'
      },
      md: {
        root: 'gap-2.5 p-2 text-sm data-[orientation=vertical]:w-30 data-[variant=thumbnail]:w-14',
        leading: 'w-10',
        leadingIcon: 'size-5',
        description: 'mt-0.5'
      },
      lg: {
        root: 'gap-3 p-2.5 text-sm data-[orientation=vertical]:w-36 data-[variant=thumbnail]:w-20',
        leading: 'w-12',
        leadingIcon: 'size-6',
        description: 'mt-0.5'
      },
      xl: {
        root: 'gap-3 p-3 text-base data-[orientation=vertical]:w-44 data-[variant=thumbnail]:w-30',
        leading: 'w-14 rounded-xl',
        leadingIcon: 'size-7',
        description: 'mt-0.5 text-sm'
      }
    },
    orientation: {
      horizontal: {
        root: 'items-center min-w-40 pe-2.5',
        remove: 'col-start-2 row-start-1 -my-1 ms-1'
      },
      vertical: {
        root: 'flex-col',
        leading: 'w-full',
        leadingIcon: 'size-6',
        wrapper: 'px-1',
        remove: 'absolute top-3 end-3 rounded-full bg-default/75 backdrop-blur-xs'
      }
    },
    variant: {
      card: {
        root: 'rounded-xl border border-default bg-default'
      },
      thumbnail: {
        root: 'p-0 min-w-0',
        leading: 'w-full outline -outline-offset-1 outline-default',
        wrapper: 'contents',
        name: 'sr-only',
        description: 'sr-only',
        remove: ['absolute -top-1.5 -end-1.5 m-0 p-0 rounded-full bg-inverted text-inverted hover:bg-inverted/90 active:bg-inverted/90 ring-2 ring-bg [@media(hover:hover)]:opacity-0 group-hover/attachment:opacity-100 group-focus-within/attachment:opacity-100', options.theme.transitions && 'transition-opacity ease-out']
      }
    },
    status: {
      idle: '',
      uploading: {
        leading: 'has-data-[slot=image]:text-highlighted',
        leadingIcon: 'animate-spin',
        image: 'opacity-50'
      },
      error: {
        root: 'border-error/30',
        leading: 'bg-error/10 text-error outline-error/30',
        image: 'opacity-50',
        description: 'text-error'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    orientation: 'horizontal',
    status: 'idle',
    variant: 'card'
  }
})
