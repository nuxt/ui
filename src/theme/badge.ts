import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  base: 'rounded-md font-medium inline-flex items-center',
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
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
    class: `bg-[--ui-${color}] text-[--ui-bg]`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'outline',
    class: `text-[--ui-${color}] ring ring-inset ring-[--ui-${color}]/50`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'soft',
    class: `bg-[--ui-${color}]/10 text-[--ui-${color}]`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'subtle',
    class: `bg-[--ui-${color}]/10 text-[--ui-${color}] ring ring-inset ring-[--ui-${color}]/25`
  })), {
    color: 'neutral',
    variant: 'solid',
    class: 'text-[--ui-bg] bg-[--ui-bg-inverted]'
  }, {
    color: 'neutral',
    variant: 'outline',
    class: 'ring ring-inset ring-[--ui-border-accented] text-[--ui-text] bg-[--ui-bg]'
  }, {
    color: 'neutral',
    variant: 'soft',
    class: 'text-[--ui-text] bg-[--ui-bg-elevated]'
  }, {
    color: 'neutral',
    variant: 'subtle',
    class: 'ring ring-inset ring-[--ui-border-accented] text-[--ui-text] bg-[--ui-bg-elevated]'
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
})
