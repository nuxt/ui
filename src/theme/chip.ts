import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative inline-flex items-center justify-center shrink-0',
    base: 'rounded-full ring ring-bg flex items-center justify-center text-inverted font-medium whitespace-nowrap'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, { base: `bg-${color}` }])),
      neutral: { base: 'bg-inverted' }
    },
    size: {
      '3xs': { base: 'h-[4px] min-w-[4px] text-[4px]' },
      '2xs': { base: 'h-[5px] min-w-[5px] text-[5px]' },
      'xs': { base: 'h-[6px] min-w-[6px] text-[6px]' },
      'sm': { base: 'h-[7px] min-w-[7px] text-[7px]' },
      'md': { base: 'h-[8px] min-w-[8px] text-[8px]' },
      'lg': { base: 'h-[9px] min-w-[9px] text-[9px]' },
      'xl': { base: 'h-[10px] min-w-[10px] text-[10px]' },
      '2xl': { base: 'h-[11px] min-w-[11px] text-[11px]' },
      '3xl': { base: 'h-[12px] min-w-[12px] text-[12px]' }
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
    class: { base: 'translate-y-1/2 translate-x-1/2 transform' }
  }, {
    position: 'top-left',
    inset: false,
    class: { base: '-translate-y-1/2 -translate-x-1/2 transform' }
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
