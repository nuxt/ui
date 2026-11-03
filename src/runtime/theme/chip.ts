import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative inline-flex items-center justify-center shrink-0',
    base: 'rounded-full ring ring-bg flex items-center justify-center text-accent-contrast font-medium whitespace-nowrap bg-accent'
  },
  variants: {
    color: colorVariant({ base: '' }),
    size: {
      '3xs': { base: 'h-1 min-w-1 text-[4px]' },
      '2xs': { base: 'h-1.25 min-w-1.25 text-[5px]' },
      'xs': { base: 'h-1.5 min-w-1.5 text-[6px]' },
      'sm': { base: 'h-1.75 min-w-1.75 text-[7px]' },
      'md': { base: 'h-2 min-w-2 text-[8px]' },
      'lg': { base: 'h-2.25 min-w-2.25 text-[9px]' },
      'xl': { base: 'h-2.5 min-w-2.5 text-[10px]' },
      '2xl': { base: 'h-2.75 min-w-2.75 text-[11px]' },
      '3xl': { base: 'h-3 min-w-3 text-[12px]' }
    },
    position: {
      'top-right': { base: 'top-0 right-0' },
      'bottom-right': { base: 'bottom-0 right-0' },
      'top-left': { base: 'top-0 left-0' },
      'bottom-left': { base: 'bottom-0 left-0' }
    },
    inset: {
      false: ''
    },
    standalone: {
      false: { base: 'absolute' }
    }
  },
  compoundVariants: [{
    position: 'top-right',
    inset: false,
    class: { base: '-translate-y-1/2 translate-x-1/2 transform' }
  }, {
    position: 'bottom-right',
    inset: false,
    class: { base: 'translate-1/2 transform' }
  }, {
    position: 'top-left',
    inset: false,
    class: { base: '-translate-1/2 transform' }
  }, {
    position: 'bottom-left',
    inset: false,
    class: { base: 'translate-y-1/2 -translate-x-1/2 transform' }
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    position: 'top-right'
  }
})
