import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'inline-flex flex-row-reverse justify-end',
    // An avatar's soft fill is translucent: moved to a pseudo-element over
    // `bg-default`, so an avatar hides the one it overlaps
    base: 'relative isolate rounded-full ring-bg first:me-0 bg-default before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:bg-accent-soft'
  },
  variants: {
    size: {
      '3xs': {
        base: 'ring -me-0.5'
      },
      '2xs': {
        base: 'ring -me-0.5'
      },
      'xs': {
        base: 'ring -me-0.5'
      },
      'sm': {
        base: 'ring-2 -me-1.5'
      },
      'md': {
        base: 'ring-2 -me-1.5'
      },
      'lg': {
        base: 'ring-2 -me-1.5'
      },
      'xl': {
        base: 'ring-3 -me-2'
      },
      '2xl': {
        base: 'ring-3 -me-2'
      },
      '3xl': {
        base: 'ring-3 -me-2'
      }
    },
    color: colorVariant({})
  },
  defaultVariants: {
    size: 'md',
    color: 'neutral'
  }
})
