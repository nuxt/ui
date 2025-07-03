export default {
  slots: {
    root: 'flex justify-between items-center shrink-0 no-wrap relative w-full px-3 overflow-x-auto',
    title: 'text-pretty pr-3 truncate font-semibold text-highlighted',
    left: 'flex items-center',
    right: 'flex items-center',
    center: 'flex items-center'
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
    },
    size: {
      sm: {
        root: 'gap-1 min-h-[40px]',
        title: 'text-sm',
        left: 'gap-1',
        center: 'gap-1',
        right: 'gap-1'
      },
      md: {
        root: 'gap-1.5 min-h-[49px]',
        title: 'text-base',
        left: 'gap-1.5',
        center: 'gap-1.5',
        right: 'gap-1.5'
      },
      lg: {
        root: 'gap-2 min-h-14',
        title: 'text-lg',
        left: 'gap-2',
        center: 'gap-2',
        right: 'gap-2'
      },
      xl: {
        root: 'gap-3 min-h-16',
        title: 'text-xl',
        left: 'gap-3',
        center: 'gap-3',
        right: 'gap-3'
      }
    }
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md'
  }
}
