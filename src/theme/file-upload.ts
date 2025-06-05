export default {
  slots: {
    root: 'group/item relative flex flex-col gap-2 items-center',
    base: 'w-full relative flex flex-col items-center overflow-hidden p-4 transition-colors bg-default shadow-sm rounded-md divide-y divide-default overflow-y-auto border border-dashed border-accented',
    dragging: 'bg-accented/20',
    empty: 'flex flex-col items-center justify-center gap-2',
    label: 'font-semibold text-highlighted text-center px-2 line-clamp-1',
    uploadIcon: 'pointer-events-none',
    files: 'space-y-2 w-full',
    filesActions: 'flex items-center justify-between w-full px-1 py-2',
    file: 'text-default rounded-md relative',
    fileContent: 'flex items-center gap-3',
    fileLeadingAvatar: 'shrink-0',
    fileLeadingAvatarSize: '',
    fileDetails: 'flex-1',
    fileLabel: 'text-default font-semibold line-clamp-1',
    fileSize: 'text-muted',
    fileImage: 'rounded-[inherit]',
    fileTrailing: 'flex items-start',
    fileRemoveButton: ''
  },
  variants: {
    size: {
      xs: {
        empty: 'min-h-16',
        label: 'text-xs',
        uploadIcon: 'size-4',
        files: 'w-full',
        file: 'p-1 text-xs gap-1',
        fileLeadingAvatarSize: 'xs'
      },
      sm: {
        empty: 'h-20',
        label: 'text-xs',
        uploadIcon: 'size-4',
        files: 'w-full',
        file: 'p-1.5 text-xs gap-1.5',
        fileLeadingAvatarSize: 'sm'
      },
      md: {
        empty: 'h-24',
        label: 'text-sm',
        uploadIcon: 'size-5',
        files: 'w-full',
        file: 'p-1.5 text-sm gap-1.5',
        fileLeadingAvatarSize: 'md'
      },
      lg: {
        empty: 'h-26',
        label: 'text-sm',
        uploadIcon: 'size-5',
        files: 'w-full',
        file: 'p-2 text-sm gap-2',
        fileLeadingAvatarSize: 'lg'
      },
      xl: {
        empty: 'h-32',
        label: 'text-base',
        uploadIcon: 'size-6',
        files: 'w-full',
        file: 'p-2 text-base gap-2',
        fileLeadingAvatarSize: 'xl'
      }
    },
    multiple: {
      true: '',
      false: ''
    },
    layout: {
      list: {
        files: 'space-y-2',
        file: 'flex justify-between items-center gap-2 p-2 border border-accented pe-3',
        fileContent: 'flex items-center gap-3',
        fileTrailing: 'flex items-start'
      },
      grid: ''
    },
    disabled: {
      true: {
        root: 'cursor-not-allowed'
      },
      false: ''
    },
    dragging: {
      true: {
        base: 'bg-accented/20'
      },
      false: ''
    },
    isEmpty: {
      true: '',
      false: ''
    },
    hasDefaultSlot: {
      true: '',
      false: ''
    },
    previewPlacement: {
      inside: '',
      outside: ''
    }
  },
  compoundVariants: [
    {
      dragging: true,
      disabled: true,
      class: {
        base: 'cursor-not-allowed bg-accented/5'
      }
    },
    {
      multiple: true,
      layout: 'grid',
      class: {
        files: 'grid grid-cols-3 gap-3',
        file: 'text-default relative',
        fileContent: 'relative rounded-md aspect-square flex items-center justify-center bg-elevated',
        fileTrailing: 'absolute -top-1 -right-1',
        fileImage: 'size-full object-cover'
      }
    },
    {
      multiple: false,
      layout: 'grid',
      class: {
        files: 'grid grid-cols-1',
        file: 'text-default rounded-md min-h-26 relative bg-elevated',
        fileContent: 'absolute inset-0 flex items-center justify-center',
        fileTrailing: 'absolute -top-2 -right-2',
        fileImage: 'mx-auto max-h-full object-contain'
      }
    },
    {
      layout: 'grid',
      class: {
        fileRemoveButton: 'rounded-full'
      }
    },
    {
      disabled: false,
      isEmpty: true,
      hasDefaultSlot: false,
      class: {
        base: 'hover:bg-accented/20'
      }
    }
  ],
  defaultVariants: {
    size: 'md',
    layout: 'list',
    disabled: false,
    dragging: false,
    isEmpty: true,
    previewPlacement: 'inside'
  }
}
