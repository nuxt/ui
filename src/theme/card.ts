export default {
  slots: {
    root: 'rounded-lg',
    header: 'p-4 sm:px-6',
    body: 'p-4 sm:p-6',
    footer: 'p-4 sm:px-6'
  },
  variants: {
    variant: {
      solid: {
        root: 'bg-(--ui-bg-inverted) text-(--ui-bg)'
      },
      outline: {
        root: 'bg-(--ui-bg) ring ring-(--ui-border) divide-y divide-(--ui-border)'
      },
      soft: {
        root: 'bg-(--ui-bg-elevated)/50 divide-y divide-(--ui-border)'
      },
      subtle: {
        root: 'bg-(--ui-bg-elevated)/50 ring ring-(--ui-border) divide-y divide-(--ui-border)'
      }
    }
  },
  defaultVariants: {
    variant: 'outline'
  }
}
