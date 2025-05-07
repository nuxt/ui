export default {
  slots: {
    root: 'relative inline-flex items-center',
    base: 'bg-default shadow-sm rounded-md divide-y divide-default overflow-y-auto border border-dashed border-accented',
    dragging: 'bg-accented/20',
    empty: 'flex flex-col items-center justify-center gap-2',
    label: 'font-semibold text-highlighted text-center px-2 line-clamp-1',
    uploadIcon: 'shrink-0',
    files: 'divide-y divide-default',
    file: 'text-default flex justify-between items-center gap-2 p-2',
    fileLabel: 'text-default font-semibold line-clamp-1',
    fileAvatar: 'shrink-0',
    fileAvatarSize: '',
    fileSize: 'text-muted'
  },
  variants: {
    size: {
      xs: {
        base: 'w-56',
        empty: 'h-16',
        label: 'text-xs',
        uploadIcon: 'size-4',
        files: 'h-10',
        file: 'p-1 text-xs gap-1',
        fileAvatarSize: 'xs'
      },
      sm: {
        base: 'w-60',
        empty: 'h-20',
        label: 'text-xs',
        uploadIcon: 'size-4',
        file: 'p-1.5 text-xs gap-1.5',
        fileAvatarSize: 'sm'
      },
      md: {
        base: 'w-64',
        empty: 'h-24',
        label: 'text-sm',
        uploadIcon: 'size-5',
        file: 'p-1.5 text-sm gap-1.5',
        fileAvatarSize: 'md'
      },
      lg: {
        base: 'w-72',
        empty: 'h-26',
        label: 'text-sm',
        uploadIcon: 'size-5',
        file: 'p-2 text-sm gap-2',
        fileAvatarSize: 'lg'
      },
      xl: {
        base: 'w-82',
        empty: 'h-32',
        label: 'text-base',
        uploadIcon: 'size-6',
        file: 'p-2 text-base gap-2',
        fileAvatarSize: 'xl'
      }
    },
    multiple: {
      true: '',
      false: ''
    }
  },
  defaultVariants: {
    size: 'md'
  }
}
