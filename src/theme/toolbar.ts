export default {
  slots: {
    root: 'flex justify-between items-center shrink-0 no-wrap relative w-full px-3 gap-1.5 overflow-x-auto min-h-[49px]',
    title: 'text-base text-pretty truncate font-semibold text-highlighted px-3',
    left: 'flex items-center gap-1.5',
    right: 'flex items-center gap-1.5',
    center: 'flex items-center gap-1.5'
  },
  variants: {
    variant: {
      solid: {
        root: 'bg-inverted text-inverted',
        title: 'text-inverted'
      },
      outline: {
        root: 'bg-default border border-default'
      },
      soft: {
        root: 'bg-elevated/50'
      },
      subtle: {
        root: 'bg-elevated/50 border border-default'
      }
    }
  },
  defaultVariants: {
    variant: 'outline'
  }
}
