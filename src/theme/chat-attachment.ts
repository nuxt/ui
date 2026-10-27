export default {
  slots: {
    root: 'group/attachment relative flex min-w-0 max-w-full w-fit shrink-0 rounded-xl border border-default bg-default',
    leading: 'relative flex items-center justify-center shrink-0 aspect-square overflow-hidden rounded-lg bg-elevated text-muted',
    leadingIcon: 'shrink-0',
    image: 'size-full object-cover',
    wrapper: 'grid grid-cols-[minmax(0,1fr)_auto] items-center min-w-0 flex-1',
    name: 'block truncate font-medium text-highlighted',
    description: 'block truncate row-start-2 text-xs text-muted',
    remove: 'shrink-0'
  },
  variants: {
    size: {
      xs: {
        root: 'gap-1.5 p-1 rounded-lg text-xs data-[orientation=vertical]:w-20',
        leading: 'w-7 rounded-md',
        leadingIcon: 'size-3.5',
        description: 'text-[10px]/3'
      },
      sm: {
        root: 'gap-2 p-1.5 text-xs data-[orientation=vertical]:w-24',
        leading: 'w-8',
        leadingIcon: 'size-4'
      },
      md: {
        root: 'gap-2.5 p-2 text-sm data-[orientation=vertical]:w-30',
        leading: 'w-10',
        leadingIcon: 'size-5',
        description: 'mt-0.5'
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
    status: {
      idle: '',
      uploading: {
        leadingIcon: 'animate-spin',
        image: 'opacity-60'
      },
      error: {
        root: 'border-error/30',
        leading: 'bg-error/10 text-error',
        description: 'text-error'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    orientation: 'horizontal',
    status: 'idle'
  }
}
