import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  base: 'focus-visible:outline-[--ui-primary]',
  variants: {
    active: {
      true: 'text-[--ui-primary]',
      false: ['text-[--ui-text-muted] hover:text-[--ui-text]', options.theme.transitions && 'transition-colors']
    },
    disabled: {
      true: 'cursor-not-allowed opacity-75'
    }
  }
})
