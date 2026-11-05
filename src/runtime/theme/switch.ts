import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative flex items-start',
    base: 'group/switch inline-flex items-center shrink-0 rounded-full border-2 border-transparent focus-visible:outline-(length:--ui-focus-width) data-[state=unchecked]:bg-strong transition-[background] duration-200 ease-out data-[state=checked]:bg-accent outline-accent-focus',
    container: 'flex items-center',
    thumb: 'group pointer-events-none rounded-full bg-default shadow-lg ring-0 transition-[transform,translate,scale,rotate,width] duration-200 ease-out motion-reduce:transition-none data-[state=unchecked]:translate-x-0 data-[state=unchecked]:rtl:translate-x-0 flex items-center justify-center',
    icon: 'absolute shrink-0 group-data-[state=unchecked]:text-faint opacity-0 size-10/12 transition-[color,opacity] duration-200 ease-out group-data-[state=checked]:text-accent',
    wrapper: 'ms-2',
    label: 'block font-medium text-default',
    description: 'text-muted'
  },
  variants: {
    color: colorVariant({ root: '' }),
    // The label and the description wrap, so they read the reading line of the size
    size: {
      xs: {
        root: '[--ui-control-box:var(--ui-control-box-xs)]',
        base: 'group/switch w-[calc(var(--ui-control-box)*2+(--spacing(1)))]',
        container: 'h-(--ui-control-text-xs--leading)',
        thumb: 'size-(--ui-control-box) data-[state=checked]:translate-x-(--ui-control-box) data-[state=checked]:rtl:-translate-x-(--ui-control-box)',
        wrapper: 'text-(length:--ui-control-text-xs)/(--ui-control-text-xs--leading)'
      },
      sm: {
        root: '[--ui-control-box:var(--ui-control-box-sm)]',
        base: 'w-[calc(var(--ui-control-box)*2+(--spacing(1)))]',
        container: 'h-(--ui-control-text-sm--leading)',
        thumb: 'size-(--ui-control-box) data-[state=checked]:translate-x-(--ui-control-box) data-[state=checked]:rtl:-translate-x-(--ui-control-box)',
        wrapper: 'text-(length:--ui-control-text-sm)/(--ui-control-text-sm--leading)'
      },
      md: {
        root: '[--ui-control-box:var(--ui-control-box-md)]',
        base: 'w-[calc(var(--ui-control-box)*2+(--spacing(1)))]',
        container: 'h-(--ui-control-text-md--leading)',
        thumb: 'size-(--ui-control-box) data-[state=checked]:translate-x-(--ui-control-box) data-[state=checked]:rtl:-translate-x-(--ui-control-box)',
        wrapper: 'text-(length:--ui-control-text-md)/(--ui-control-text-md--leading)'
      },
      lg: {
        root: '[--ui-control-box:var(--ui-control-box-lg)]',
        base: 'w-[calc(var(--ui-control-box)*2+(--spacing(1)))]',
        container: 'h-(--ui-control-text-lg--leading)',
        thumb: 'size-(--ui-control-box) data-[state=checked]:translate-x-(--ui-control-box) data-[state=checked]:rtl:-translate-x-(--ui-control-box)',
        wrapper: 'text-(length:--ui-control-text-lg)/(--ui-control-text-lg--leading)'
      },
      xl: {
        root: '[--ui-control-box:var(--ui-control-box-xl)]',
        base: 'w-[calc(var(--ui-control-box)*2+(--spacing(1)))]',
        container: 'h-(--ui-control-text-xl--leading)',
        thumb: 'size-(--ui-control-box) data-[state=checked]:translate-x-(--ui-control-box) data-[state=checked]:rtl:-translate-x-(--ui-control-box)',
        wrapper: 'text-(length:--ui-control-text-xl)/(--ui-control-text-xl--leading)'
      }
    },
    checked: {
      true: {
        icon: 'group-data-[state=checked]:opacity-100'
      }
    },
    unchecked: {
      true: {
        icon: 'group-data-[state=unchecked]:opacity-100'
      }
    },
    loading: {
      true: {
        icon: 'animate-spin'
      }
    },
    highlight: {
      true: {
        base: 'ring ring-accent'
      }
    },
    required: {
      true: {
        label: `after:content-['*'] after:ms-0.5 after:text-error`
      }
    },
    disabled: {
      true: {
        root: 'opacity-(--ui-disabled-opacity)',
        base: 'cursor-not-allowed',
        label: 'cursor-not-allowed',
        description: 'cursor-not-allowed'
      }
    }
  },
  defaultVariants: {
    color: 'primary',
    size: 'md'
  }
})
