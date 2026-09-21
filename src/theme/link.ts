import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    base: 'outline-primary/25 focus-visible:outline-3 rounded-md'
  },
  variants: {
    active: {
      true: { base: 'text-primary' },
      false: { base: 'text-muted' }
    },
    disabled: {
      true: { base: 'cursor-not-allowed opacity-75' }
    }
  },
  compoundVariants: [{
    active: false,
    disabled: false,
    class: { base: ['hover:text-default', options.theme.transitions && 'transition-colors'] }
  }]
})
