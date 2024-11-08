import type { ModuleOptions } from '../module'
import inputTheme from './input'

export default (options: Required<ModuleOptions>) => {
  const input = inputTheme(options)

  return {
    slots: {
      root: '',
      container: '',
      base: '',
      icon: ''
    },
    variants: {
      color: {
        ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
        neutral: ''
      },
      size: {
        xs: {},
        sm: {},
        md: {},
        lg: {},
        xl: {}
      },
      variant: {
        ...input.variants.variant
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md',
      color: 'primary',
      variant: 'outline'
    }
  }
}
