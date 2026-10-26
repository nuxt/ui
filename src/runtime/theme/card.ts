import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'rounded-lg overflow-hidden',
    header: 'px-(--ui-gutter) py-4',
    title: 'text-strong font-heading font-(--ui-font-weight-heading,--theme(--font-weight-semibold))',
    description: 'mt-1 text-muted text-sm',
    body: 'p-(--ui-gutter)',
    footer: 'px-(--ui-gutter) py-4'
  },
  variants: {
    variant: {
      solid: {
        root: 'bg-neutral text-contrast',
        title: 'text-contrast',
        description: 'text-faint'
      },
      outline: {
        root: 'bg-default ring ring-default divide-y divide-default'
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
