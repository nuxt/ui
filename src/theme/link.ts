import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  base: 'focus-visible:outline-[var(--ui-primary)]',
  variants: {
    active: {
      true: 'text-[var(--ui-primary)]',
      false: ['text-[var(--ui-text-muted)] hover:text-[var(--ui-text)]', options.theme.transitions && 'transition-colors']
    },
    disabled: {
      true: 'cursor-not-allowed opacity-75'
    }
  }
})
