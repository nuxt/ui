import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  base: 'focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400',
  variants: {
    active: {
      true: 'text-primary-500 dark:text-primary-400',
      false: ['text-[--ui-text-muted] hover:text-[--ui-text]', options.theme.transitions && 'transition-colors']
    },
    disabled: {
      true: 'cursor-not-allowed opacity-75'
    }
  }
})
