import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'rounded-lg overflow-hidden',
    header: 'p-4 sm:px-6',
    title: 'text-highlighted font-semibold',
    description: 'mt-1 text-muted text-sm',
    body: 'p-4 sm:p-6',
    footer: 'p-4 sm:px-6'
  },
  variants: {
    variant: {
      solid: {
        root: 'bg-inverted text-inverted',
        title: 'text-inverted',
        description: 'text-faint'
      },
      outline: {
        root: 'bg-surface ring ring-default divide-y divide-default'
      },
      soft: {
        root: 'bg-tint divide-y divide-default'
      },
      subtle: {
        root: 'bg-tint ring ring-default divide-y divide-default'
      }
    }
  },
  defaultVariants: {
    variant: 'outline'
  }
})
