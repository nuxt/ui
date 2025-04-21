import { defu } from 'defu'
import type { ModuleOptions } from '../module'
import checkbox from './checkbox'

export default (options: Required<ModuleOptions>) => {
  return defu({
    slots: {
      root: 'relative',
      fieldset: 'relative flex',
      legend: 'mb-1 block font-medium text-default',
      wrapper: 'w-full'
    },
    variants: {
      orientation: {
        horizontal: {
          fieldset: 'flex-row',
          wrapper: 'me-2'
        },
        vertical: {
          fieldset: 'flex-col'
        }
      },
      size: {
        xs: {
          fieldset: 'gap-0.5',
          legend: 'text-xs'
        },
        sm: {
          fieldset: 'gap-0.5',
          legend: 'text-xs'
        },
        md: {
          fieldset: 'gap-1',
          legend: 'text-sm'
        },
        lg: {
          fieldset: 'gap-1',
          legend: 'text-sm'
        },
        xl: {
          fieldset: 'gap-1.5',
          legend: 'text-base'
        }
      },
      required: {
        true: {
          legend: 'after:content-[\'*\'] after:ms-0.5 after:text-error'
        }
      }
    },
    compoundVariants: [
      {
        orientation: 'horizontal',
        variant: 'table',
        class: {
          fieldset: 'gap-0 -space-x-px'
        }
      },
      {
        orientation: 'vertical',
        variant: 'table',
        class: {
          fieldset: 'gap-0 -space-y-px'
        }
      }
    ]
  }, checkbox(options))
}
