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
        selector: 'size-38',
        track: 'h-38'
      },
      sm: {
        selector: 'size-40',
        track: 'h-40'
      },
      md: {
        selector: 'size-42',
        track: 'h-42'
      },
      lg: {
        selector: 'size-44',
        track: 'h-44'
      },
      xl: {
        selector: 'size-46',
        track: 'h-46'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
})
