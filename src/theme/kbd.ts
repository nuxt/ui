import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    base: 'inline-flex items-center justify-center px-1 rounded-sm font-medium font-sans uppercase'
  },
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
      sm: { base: 'h-4 min-w-[16px] text-[10px]' },
      md: { base: 'h-5 min-w-[20px] text-[11px]' },
      lg: { base: 'h-6 min-w-[24px] text-[12px]' }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'solid',
    class: { base: `text-inverted bg-${color}` }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'outline',
    class: { base: `ring ring-inset ring-${color}/50 text-${color}` }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'soft',
    class: { base: `text-${color} bg-${color}/10` }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'subtle',
    class: { base: `text-${color} ring ring-inset ring-${color}/25 bg-${color}/10` }
  })), {
    color: 'neutral',
    variant: 'solid',
    class: { base: 'text-inverted bg-inverted' }
  }, {
    color: 'neutral',
    variant: 'outline',
    class: { base: 'ring ring-inset ring-accented text-default bg-default' }
  }, {
    color: 'neutral',
    variant: 'soft',
    class: { base: 'text-default bg-elevated' }
  }, {
    color: 'neutral',
    variant: 'subtle',
    class: { base: 'ring ring-inset ring-accented text-default bg-elevated' }
  }],
  defaultVariants: {
    variant: 'outline',
    color: 'neutral',
    size: 'md'
  }
})
