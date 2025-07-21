import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative flex flex-col gap-2',
    base: ['w-full bg-default hover:bg-elevated/25 border border-default p-4 flex flex-col items-center justify-center rounded-lg focus-visible:outline-2', options.theme.transitions && 'transition-[background]'],
    wrapper: 'flex flex-col items-center justify-center text-center px-4 py-3',
    leading: 'inline-flex items-center rounded-full ring ring-default',
    leadingIcon: 'shrink-0 text-default',
    label: 'font-medium text-default mt-2',
    description: 'text-muted mt-1',
    actions: 'flex flex-wrap gap-1.5 shrink-0',
    files: 'flex flex-col items-start gap-2',
    file: 'min-w-0 flex items-center gap-2 border border-default rounded-md w-full',
    fileLeadingAvatar: 'shrink-0',
    fileTrailing: 'ms-auto p-0',
    fileWrapper: 'flex flex-col min-w-0',
    fileName: 'text-default truncate',
    fileSize: 'text-muted truncate'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    size: {
      xs: {
        base: 'text-xs',
        leading: 'p-1',
        leadingIcon: 'size-4',
        file: 'text-xs px-2 py-1',
        fileWrapper: 'flex-row gap-1'
      },
      sm: {
        base: 'text-xs',
        leading: 'p-1.5',
        leadingIcon: 'size-4',
        file: 'text-xs px-2.5 py-1.5',
        fileWrapper: 'flex-row gap-1'
      },
      md: {
        base: 'text-sm',
        leading: 'p-1.5',
        leadingIcon: 'size-5',
        file: 'text-xs px-2.5 py-1.5'
      },
      lg: {
        base: 'text-sm',
        leading: 'p-2',
        leadingIcon: 'size-5',
        file: 'text-sm px-3 py-2',
        fileSize: 'text-xs'
      },
      xl: {
        base: 'text-base',
        leading: 'p-2',
        leadingIcon: 'size-6',
        file: 'text-sm px-3 py-2'
      }
    },
    dropzone: {
      true: 'border-dashed data-[dragging=true]:bg-elevated/25'
    },
    highlight: {
      true: ''
    },
    disabled: {
      true: 'cursor-not-allowed opacity-75'
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    class: `focus-visible:outline-${color}`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    highlight: true,
    class: `ring ring-inset ring-${color}`
  })), {
    color: 'neutral',
    class: 'focus-visible:outline-inverted'
  }, {
    color: 'neutral',
    highlight: true,
    class: 'ring ring-inset ring-inverted'
  }],
  defaultVariants: {
    color: 'primary',
    size: 'md'
  }
})
