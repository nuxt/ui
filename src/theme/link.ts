import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  base: 'outline-primary/25 focus-visible:outline-3 rounded-md',
  variants: {
    active: {
      true: 'text-primary',
      false: 'text-muted'
    },
    disabled: {
      true: 'cursor-not-allowed opacity-75'
    }
  },
  compoundVariants: [{
    active: false,
    disabled: false,
    class: ['hover:text-default', options.theme.transitions && 'transition-colors']
  }]
})
