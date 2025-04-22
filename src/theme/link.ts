import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  base: 'focus-visible:outline-primary',
  variants: {
    active: {
      true: 'text-primary',
      false: ['text-muted hover:text-default', options.theme.transitions && 'transition-colors']
    },
    disabled: {
      true: 'cursor-not-allowed opacity-75'
    }
  }
})
