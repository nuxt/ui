import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  base: 'rounded-md font-medium inline-flex items-center',
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      gray: ''
    },
    variant: {
      solid: '',
      outline: '',
      soft: '',
      subtle: ''
    },
    size: {
      sm: 'text-xs px-1.5 py-0.5',
      md: 'text-xs px-2 py-1',
      lg: 'text-sm px-2 py-1'
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'solid',
    class: `bg-${color}-500 dark:bg-${color}-400 text-[--ui-bg]`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'outline',
    class: `text-${color}-500 dark:text-${color}-400 ring ring-inset ring-${color}-500/50 dark:ring-${color}-400/50`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'soft',
    class: `bg-${color}-500/10 dark:bg-${color}-400/10 text-${color}-500 dark:text-${color}-400`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'subtle',
    class: `bg-${color}-500/10 dark:bg-${color}-400/10 text-${color}-500 dark:text-${color}-400 ring ring-inset ring-${color}-500/25 dark:ring-${color}-400/25`
  })), {
    color: 'gray',
    variant: 'solid',
    class: 'text-[--ui-bg] bg-[--ui-bg-inverted]'
  }, {
    color: 'gray',
    variant: 'outline',
    class: 'ring ring-inset ring-[--ui-border-accented] text-[--ui-text] bg-[--ui-bg]'
  }, {
    color: 'gray',
    variant: 'soft',
    class: 'text-[--ui-text] bg-[--ui-bg-elevated]'
  }, {
    color: 'gray',
    variant: 'subtle',
    class: 'ring ring-inset ring-[--ui-border-accented] text-[--ui-text] bg-[--ui-bg-elevated]'
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
})
