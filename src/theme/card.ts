export default {
  slots: {
    root: 'rounded-lg overflow-hidden',
    header: 'p-4 sm:px-6',
    body: 'p-4 sm:p-6',
    footer: 'p-4 sm:px-6'
  },
  variants: {
    size: {
      xs: {
        header: 'p-2 sm:px-4',
        body: 'p-2 sm:p-4',
        footer: 'p-2 sm:px-4'
      },
      sm: {
        header: 'p-3 sm:px-5',
        body: 'p-3 sm:p-5',
        footer: 'p-3 sm:px-5'
      },
      md: {
        header: 'p-4 sm:px-6',
        body: 'p-4 sm:p-6',
        footer: 'p-4 sm:px-6'
      },
      lg: {
        header: 'p-5 sm:px-7',
        body: 'p-5 sm:p-7',
        footer: 'p-5 sm:px-7'
      },
      xl: {
        header: 'p-6 sm:px-8',
        body: 'p-6 sm:p-8',
        footer: 'p-6 sm:px-8'
      }
    },
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
    variant: 'outline',
    size: 'md'
  }
}
