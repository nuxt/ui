import { defuFn } from 'defu'
import type { ModuleOptions } from '../module'
import input from './input'

export default (options: Required<ModuleOptions>) => {
  return defuFn({
    slots: {
      base: (prev: string) => [prev, 'select-none relative inline-flex items-center align-middle !gap-0'],
      segment: 'focus:bg-muted data-invalid:data-focused:bg-error data-focused:data-placeholder:text-muted data-focused:text-highlighted data-invalid:data-placeholder:text-error data-invalid:text-error data-placeholder:text-muted data-[segment=literal]:text-muted rounded outline-hidden data-disabled:cursor-not-allowed data-disabled:opacity-75 data-invalid:data-focused:text-white data-invalid:data-focused:data-placeholder:text-white text-center'
    },
    variants: {
      size: {
        xs: {
          segment: 'w-7'
        },
        sm: {
          segment: 'w-7'
        },
        md: {
          segment: 'w-8'
        },
        lg: {
          segment: 'w-8'
        },
        xl: {
          segment: 'w-9'
        }
      }
    }
  }, input(options))
}
