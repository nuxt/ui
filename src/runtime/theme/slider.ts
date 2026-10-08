import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative flex items-center select-none touch-none',
    track: 'relative bg-strong overflow-hidden rounded-full grow',
    range: 'absolute rounded-full bg-accent',
    thumb: 'rounded-full bg-default ring-2 focus-visible:outline-3 focus-visible:outline-offset-2 ring-accent outline-accent-focus'
  },
  variants: {
    color: colorVariant({ root: '' }),
    size: {
      xs: {
        root: '[--ui-control-thickness:6px] [--ui-control-size:--spacing(3)]',
        thumb: 'size-(--ui-control-size)'
      },
      sm: {
        root: '[--ui-control-thickness:7px] [--ui-control-size:--spacing(3.5)]',
        thumb: 'size-(--ui-control-size)'
      },
      md: {
        root: '[--ui-control-thickness:8px] [--ui-control-size:--spacing(4)]',
        thumb: 'size-(--ui-control-size)'
      },
      lg: {
        root: '[--ui-control-thickness:9px] [--ui-control-size:--spacing(4.5)]',
        thumb: 'size-(--ui-control-size)'
      },
      xl: {
        root: '[--ui-control-thickness:10px] [--ui-control-size:--spacing(5)]',
        thumb: 'size-(--ui-control-size)'
      }
    },
    orientation: {
      horizontal: {
        root: 'w-full',
        track: 'h-(--ui-control-thickness)',
        range: 'h-full'
      },
      vertical: {
        root: 'flex-col h-full',
        track: 'w-(--ui-control-thickness)',
        range: 'w-full'
      }
    },
    disabled: {
      true: {
        root: 'opacity-75 cursor-not-allowed'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'primary'
  }
})
