import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative flex items-center select-none touch-none',
    track: 'relative bg-strong overflow-hidden rounded-full grow',
    range: 'absolute rounded-full bg-accent',
    thumb: 'size-(--ui-control-box) rounded-full bg-default ring-2 focus-visible:outline-(length:--ui-focus-width) focus-visible:outline-offset-2 ring-accent outline-accent-focus'
  },
  variants: {
    color: colorVariant({ root: '' }),
    size: {
      xs: {
        root: '[--ui-control-thickness:6px] [--ui-control-box:var(--ui-control-box-xs)]'
      },
      sm: {
        root: '[--ui-control-thickness:7px] [--ui-control-box:var(--ui-control-box-sm)]'
      },
      md: {
        root: '[--ui-control-thickness:8px] [--ui-control-box:var(--ui-control-box-md)]'
      },
      lg: {
        root: '[--ui-control-thickness:9px] [--ui-control-box:var(--ui-control-box-lg)]'
      },
      xl: {
        root: '[--ui-control-thickness:10px] [--ui-control-box:var(--ui-control-box-xl)]'
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
        root: 'opacity-(--ui-disabled-opacity) cursor-not-allowed'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'primary'
  }
})
