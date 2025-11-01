import { defuFn } from 'defu'
import type { ModuleOptions } from '../module'
import input from './input'

export default (options: Required<ModuleOptions>) => {
  return defuFn({
    slots: {
      base: () => ['w-full select-none relative group rounded-md inline-flex items-center align-middle focus:outline-none !gap-0', options.theme.transitions && 'transition-colors'],
      segment: 'focus:bg-muted data-invalid:data-focused:bg-error data-focused:data-placeholder:text-muted data-focused:text-highlighted data-invalid:data-placeholder:text-error data-invalid:text-error data-placeholder:text-muted data-[segment=literal]:text-muted rounded outline-hidden data-disabled:cursor-not-allowed data-disabled:opacity-75 data-invalid:data-focused:text-white data-invalid:data-focused:data-placeholder:text-white text-center'
    },
    variants: {
      variant: {
        outline: 'text-highlighted bg-default ring ring-inset ring-accented',
        soft: 'text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50',
        subtle: 'text-highlighted bg-elevated ring ring-inset ring-accented',
        ghost: 'text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent',
        none: 'text-highlighted bg-transparent'
      },
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
    },
    compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: ['outline', 'subtle'],
      class: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`
    })), ...(options.theme.colors || []).map((color: string) => ({
      color,
      highlight: true,
      class: `ring ring-inset ring-${color}`
    })), {
      color: 'neutral',
      variant: ['outline', 'subtle'],
      class: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted'
    }, {
      color: 'neutral',
      highlight: true,
      class: 'ring ring-inset ring-inverted'
    }]
  }, input(options))
}
