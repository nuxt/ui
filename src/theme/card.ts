export default {
  slots: {
    root: 'rounded-lg overflow-hidden',
    header: 'p-4 sm:px-6',
    body: 'p-4 sm:p-6',
    footer: 'p-4 sm:px-6'
  },
  variants: {
    variant: {
      solid: {
        root: 'bg-inverted text-inverted'
      },
      outline: {
        root: 'bg-default ring ring-default divide-y divide-default'
      },
      soft: {
        root: 'bg-elevated/50 divide-y divide-default'
      },
      subtle: {
        root: 'bg-elevated/50 ring ring-default divide-y divide-default'
      }
    }
  },
  defaultVariants: {
    variant: 'outline'
  }
}
