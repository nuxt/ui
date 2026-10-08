import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'data-disabled:opacity-75',
    picker: 'flex gap-4',
    selector: 'rounded-md touch-none size-(--ui-control-size)',
    selectorBackground: 'size-full relative rounded-md',
    selectorThumb: '-translate-1/2 absolute size-4 ring-2 ring-white rounded-full cursor-pointer data-disabled:cursor-not-allowed',
    track: 'w-[8px] relative rounded-md touch-none h-(--ui-control-size)',
    trackThumb: 'absolute transform -translate-y-1/2 translate-x-[-4px] rtl:translate-x-[4px] size-4 rounded-full ring-2 ring-white cursor-pointer data-disabled:cursor-not-allowed'
  },
  variants: {
    size: {
      xs: {
        root: '[--ui-control-size:--spacing(38)]'
      },
      sm: {
        root: '[--ui-control-size:--spacing(40)]'
      },
      md: {
        root: '[--ui-control-size:--spacing(42)]'
      },
      lg: {
        root: '[--ui-control-size:--spacing(44)]'
      },
      xl: {
        root: '[--ui-control-size:--spacing(46)]'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
})
