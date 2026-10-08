import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'data-disabled:opacity-75',
    picker: 'flex gap-4',
    selector: 'rounded-md touch-none',
    selectorBackground: 'size-full relative rounded-md',
    selectorThumb: '-translate-1/2 absolute size-4 ring-2 ring-white rounded-full cursor-pointer data-disabled:cursor-not-allowed',
    track: 'w-[8px] relative rounded-md touch-none',
    trackThumb: 'absolute transform -translate-y-1/2 translate-x-[-4px] rtl:translate-x-[4px] size-4 rounded-full ring-2 ring-white cursor-pointer data-disabled:cursor-not-allowed'
  },
  variants: {
    size: {
      xs: {
        root: '[--ui-control-size:--spacing(38)]',
        selector: 'size-(--ui-control-size)',
        track: 'h-(--ui-control-size)'
      },
      sm: {
        root: '[--ui-control-size:--spacing(40)]',
        selector: 'size-(--ui-control-size)',
        track: 'h-(--ui-control-size)'
      },
      md: {
        root: '[--ui-control-size:--spacing(42)]',
        selector: 'size-(--ui-control-size)',
        track: 'h-(--ui-control-size)'
      },
      lg: {
        root: '[--ui-control-size:--spacing(44)]',
        selector: 'size-(--ui-control-size)',
        track: 'h-(--ui-control-size)'
      },
      xl: {
        root: '[--ui-control-size:--spacing(46)]',
        selector: 'size-(--ui-control-size)',
        track: 'h-(--ui-control-size)'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
})
