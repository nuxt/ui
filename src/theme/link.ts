import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  base: 'outline-transparent focus-visible:outline-2 focus-visible:outline-primary/25 focus-visible:ring focus-visible:ring-inset focus-visible:ring-primary/50',
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
