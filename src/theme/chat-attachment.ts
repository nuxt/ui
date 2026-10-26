export default {
  slots: {
    root: 'relative flex items-center min-w-0 max-w-full w-fit shrink-0 rounded-lg ring ring-default bg-default',
    leading: 'relative flex items-center justify-center shrink-0 aspect-square overflow-hidden rounded-md bg-elevated text-muted',
    leadingIcon: 'shrink-0',
    image: 'size-full object-cover',
    wrapper: 'flex flex-col min-w-0 flex-1',
    name: 'block truncate font-medium text-highlighted',
    description: 'block truncate text-muted',
    remove: 'shrink-0'
  },
  variants: {
    size: {
      xs: {
        root: 'p-1 pe-1.5 gap-1.5 text-xs',
        leading: 'size-7',
        leadingIcon: 'size-3.5',
        description: 'text-[10px]/3'
      },
      sm: {
        root: 'p-1.5 pe-2 gap-2 text-xs',
        leading: 'size-8',
        leadingIcon: 'size-4',
        description: 'text-xs/4'
      },
      md: {
        root: 'p-2 pe-2.5 gap-2.5 text-sm',
        leading: 'size-10',
        leadingIcon: 'size-5',
        description: 'mt-0.5 text-xs'
      }
    },
    status: {
      idle: '',
      uploading: {
        image: 'opacity-60'
      },
      error: {
        root: 'ring-error/40',
        leading: 'bg-error/10 text-error',
        description: 'text-error'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    status: 'idle'
  }
}
