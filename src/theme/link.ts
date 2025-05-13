import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  base: 'focus-visible:outline-primary',
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
