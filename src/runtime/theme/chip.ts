import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative inline-flex items-center justify-center shrink-0',
    base: 'rounded-full ring ring-bg flex items-center justify-center text-accent-contrast font-medium whitespace-nowrap bg-accent h-(--ui-control-size) min-w-(--ui-control-size)'
  },
  variants: {
    color: colorVariant({ base: '' }),
    size: {
      '3xs': { base: '[--ui-control-size:4px] text-[4px]' },
      '2xs': { base: '[--ui-control-size:5px] text-[5px]' },
      'xs': { base: '[--ui-control-size:6px] text-[6px]' },
      'sm': { base: '[--ui-control-size:7px] text-[7px]' },
      'md': { base: '[--ui-control-size:8px] text-[8px]' },
      'lg': { base: '[--ui-control-size:9px] text-[9px]' },
      'xl': { base: '[--ui-control-size:10px] text-[10px]' },
      '2xl': { base: '[--ui-control-size:11px] text-[11px]' },
      '3xl': { base: '[--ui-control-size:12px] text-[12px]' }
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
