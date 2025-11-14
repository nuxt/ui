import { defuFn } from 'defu'
import type { ModuleOptions } from '../module'
import input from './input'

export default (options: Required<ModuleOptions>) => {
  return defuFn({
    slots: {
      root: () => undefined,
      base: () => ['group relative inline-flex items-center rounded-md select-none', options.theme.transitions && 'transition-colors'],
      segment: ['rounded text-center outline-hidden data-placeholder:text-dimmed data-[segment=literal]:text-muted data-invalid:text-error data-disabled:cursor-not-allowed data-disabled:opacity-75', options.theme.transitions && 'transition-colors'],
      separatorIcon: 'shrink-0 size-4 text-muted'
    },
    variants: {
      size: {
        xs: {
          base: (prev: string) => [prev, 'gap-0.25'],
          segment: 'data-[segment=day]:w-6 data-[segment=month]:w-6 data-[segment=year]:w-9'
        },
        sm: {
          base: (prev: string) => [prev, 'gap-0.5'],
          segment: 'data-[segment=day]:w-6 data-[segment=month]:w-6 data-[segment=year]:w-9'
        },
        md: {
          base: (prev: string) => [prev, 'gap-0.5'],
          segment: 'data-[segment=day]:w-7 data-[segment=month]:w-7 data-[segment=year]:w-11'
        },
        lg: {
          base: (prev: string) => [prev, 'gap-0.75'],
          segment: 'data-[segment=day]:w-7 data-[segment=month]:w-7 data-[segment=year]:w-11'
        },
        xl: {
          base: (prev: string) => [prev, 'gap-0.75'],
          segment: 'data-[segment=day]:w-8 data-[segment=month]:w-8 data-[segment=year]:w-13'
        }
      }
    },
    compoundVariants: [{
      variant: 'outline',
      class: {
        segment: 'focus:bg-elevated'
      }
    }, {
      variant: 'soft',
      class: {
        segment: 'focus:bg-accented/50 group-hover:focus:bg-accented'
      }
    }, {
      variant: 'subtle',
      class: {
        segment: 'focus:bg-accented'
      }
    }, {
      variant: 'ghost',
      class: {
        segment: 'focus:bg-elevated group-hover:focus:bg-accented'
      }
    }, {
      variant: 'none',
      class: {
        segment: 'focus:bg-elevated'
      }
    }]
  }, input(options))
}
