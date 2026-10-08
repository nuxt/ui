import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative flex flex-col',
    base: 'w-full flex-1 bg-default border border-default flex flex-col gap-2 items-stretch justify-center rounded-lg focus-visible:outline-3 transition-[background] ease-out outline-accent-focus focus-visible:outline-3 focus-visible:border-accent',
    wrapper: 'flex flex-col items-center justify-center text-center',
    icon: 'shrink-0 size-(--ui-control-icon)',
    avatar: 'shrink-0',
    label: 'font-medium text-default mt-2',
    description: 'text-muted mt-1',
    actions: 'flex flex-wrap gap-1.5 shrink-0 mt-4',
    files: '',
    file: 'relative px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap)',
    fileLeadingAvatar: 'shrink-0',
    fileWrapper: 'flex flex-col min-w-0',
    fileName: 'text-default truncate',
    fileSize: 'text-muted truncate',
    fileTrailingButton: ''
  },
  variants: {
    color: colorVariant({ root: '' }),
    variant: {
      area: {
        wrapper: 'px-4 py-3',
        base: 'p-4'
      },
      button: {
        base: 'p-(--ui-control-py)'
      }
    },
    size: {
      xs: {
        root: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)]',
        base: 'text-xs',
        file: 'text-xs',
        fileWrapper: 'flex-row gap-1'
      },
      sm: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)]',
        base: 'text-xs',
        file: 'text-xs',
        fileWrapper: 'flex-row gap-1'
      },
      md: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)]',
        base: 'text-sm',
        file: 'text-xs'
      },
      lg: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)]',
        base: 'text-sm',
        file: 'text-sm',
        fileSize: 'text-xs'
      },
      xl: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)]',
        base: 'text-base',
        file: 'text-sm'
      }
    },
    layout: {
      list: {
        root: 'gap-2 items-start',
        files: 'flex flex-col w-full gap-2',
        file: 'min-w-0 flex items-center border border-default rounded-md w-full',
        fileTrailingButton: 'ms-auto'
      },
      grid: {
        fileWrapper: 'hidden',
        fileLeadingAvatar: 'size-full rounded-lg',
        fileTrailingButton: 'absolute -top-1.5 -inset-e-1.5 p-0 rounded-full border-2 border-bg'
      }
    },
    position: {
      inside: '',
      outside: ''
    },
    dropzone: {
      true: { base: 'border-dashed data-[dragging=true]:bg-tint' }
    },
    interactive: {
      true: ''
    },
    highlight: {
      true: { base: 'border-accent' }
    },
    multiple: {
      true: ''
    },
    disabled: {
      true: { base: 'cursor-not-allowed opacity-75' }
    }
  },
  compoundVariants: [{
    size: 'xs',
    layout: 'list',
    class: {
      fileTrailingButton: '-me-1'
    }
  }, {
    size: 'sm',
    layout: 'list',
    class: {
      fileTrailingButton: '-me-1.5'
    }
  }, {
    size: 'md',
    layout: 'list',
    class: {
      fileTrailingButton: '-me-1.5'
    }
  }, {
    size: 'lg',
    layout: 'list',
    class: {
      fileTrailingButton: '-me-2'
    }
  }, {
    size: 'xl',
    layout: 'list',
    class: {
      fileTrailingButton: '-me-2'
    }
  }, {
    layout: 'grid',
    multiple: true,
    class: {
      files: 'grid grid-cols-2 md:grid-cols-3 gap-4 w-full',
      file: 'p-0 aspect-square'
    }
  }, {
    layout: 'grid',
    multiple: false,
    class: {
      file: 'absolute inset-0 p-0'
    }
  }, {
    interactive: true,
    disabled: false,
    class: { base: 'hover:bg-tint' }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'area',
    size: 'md'
  }
})
