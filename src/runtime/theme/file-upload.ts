import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative flex flex-col',
    base: 'w-full flex-1 bg-default border border-default flex flex-col gap-2 items-stretch justify-center rounded-lg focus-visible:outline-(length:--ui-focus-width) transition-[background] ease-out outline-accent-focus focus-visible:outline-(length:--ui-focus-width) focus-visible:border-accent',
    wrapper: 'flex flex-col items-center justify-center text-center',
    icon: 'shrink-0',
    avatar: 'shrink-0',
    label: 'font-medium text-default mt-2',
    description: 'text-muted mt-1',
    actions: 'flex flex-wrap gap-1.5 shrink-0 mt-4',
    files: '',
    file: 'relative',
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
        root: '[--ui-control-px:var(--ui-control-px-xs)] [--ui-control-py:var(--ui-control-py-xs)] [--ui-control-gap:var(--ui-control-gap-xs)] [--ui-control-icon-size:var(--ui-control-icon-size-xs)]',
        base: 'text-(length:--ui-control-text-xs)/(--ui-control-text-xs--line-height)',
        icon: 'size-(--ui-control-icon-size)',
        file: 'text-xs px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap)',
        fileWrapper: 'flex-row gap-1'
      },
      sm: {
        root: '[--ui-control-px:var(--ui-control-px-sm)] [--ui-control-py:var(--ui-control-py-sm)] [--ui-control-gap:var(--ui-control-gap-sm)] [--ui-control-icon-size:var(--ui-control-icon-size-sm)]',
        base: 'text-(length:--ui-control-text-sm)/(--ui-control-text-sm--line-height)',
        icon: 'size-(--ui-control-icon-size)',
        file: 'text-xs px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap)',
        fileWrapper: 'flex-row gap-1'
      },
      md: {
        root: '[--ui-control-px:var(--ui-control-px-md)] [--ui-control-py:var(--ui-control-py-md)] [--ui-control-gap:var(--ui-control-gap-md)] [--ui-control-icon-size:var(--ui-control-icon-size-md)]',
        base: 'text-(length:--ui-control-text-md)/(--ui-control-text-md--line-height)',
        icon: 'size-(--ui-control-icon-size)',
        file: 'text-xs px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap)'
      },
      lg: {
        root: '[--ui-control-px:var(--ui-control-px-lg)] [--ui-control-py:var(--ui-control-py-lg)] [--ui-control-gap:var(--ui-control-gap-lg)] [--ui-control-icon-size:var(--ui-control-icon-size-lg)]',
        base: 'text-(length:--ui-control-text-lg)/(--ui-control-text-lg--line-height)',
        icon: 'size-(--ui-control-icon-size)',
        file: 'text-sm px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap)',
        fileSize: 'text-xs'
      },
      xl: {
        root: '[--ui-control-px:var(--ui-control-px-xl)] [--ui-control-py:var(--ui-control-py-xl)] [--ui-control-gap:var(--ui-control-gap-xl)] [--ui-control-icon-size:var(--ui-control-icon-size-xl)]',
        base: 'text-(length:--ui-control-text-xl)/(--ui-control-text-xl--line-height)',
        icon: 'size-(--ui-control-icon-size)',
        file: 'text-sm px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap)'
      }
    },
    layout: {
      list: {
        root: 'gap-2 items-start',
        files: 'flex flex-col w-full gap-2',
        file: 'min-w-0 flex items-center border border-default rounded-md w-full',
        fileTrailingButton: 'ms-auto -me-(--ui-control-py)'
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
      true: { base: 'cursor-not-allowed opacity-(--ui-disabled-opacity)' }
    }
  },
  compoundVariants: [{
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
