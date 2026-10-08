import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'inline-flex items-center justify-center shrink-0 select-none rounded-full align-middle bg-accent-soft size-(--ui-control-size)',
    image: 'size-full rounded-[inherit] object-cover',
    fallback: 'font-medium truncate text-accent-muted',
    icon: 'shrink-0 text-accent-muted'
  },
  variants: {
    color: colorVariant({ root: '' }),
    size: {
      '3xs': {
        root: '[--ui-control-size:--spacing(4)] text-[8px]'
      },
      '2xs': {
        root: '[--ui-control-size:--spacing(5)] text-[10px]'
      },
      'xs': {
        root: '[--ui-control-size:--spacing(6)] text-xs'
      },
      'sm': {
        root: '[--ui-control-size:--spacing(7)] text-sm'
      },
      'md': {
        root: '[--ui-control-size:--spacing(8)] text-base'
      },
      'lg': {
        root: '[--ui-control-size:--spacing(9)] text-lg'
      },
      'xl': {
        root: '[--ui-control-size:--spacing(10)] text-xl'
      },
      '2xl': {
        root: '[--ui-control-size:--spacing(11)] text-[22px]'
      },
      '3xl': {
        root: '[--ui-control-size:--spacing(12)] text-2xl'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'neutral'
  }
})
