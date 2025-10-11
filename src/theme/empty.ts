export default {
  slots: {
    root: 'relative isolate w-full rounded-lg space-y-8 p-4 sm:p-6',
    container: 'flex flex-col items-center gap-6',
    content: 'mx-auto',
    wrapper: 'max-w-sm flex flex-col items-center gap-y-2 text-center',
    icon: 'size-8',
    iconWrapper: 'size-14',
    title: 'text-2xl font-pretty font-bold text-highlighted tracking-tight',
    description: 'text-base text-muted text-balance',
    actions: 'flex flex-wrap items-center justify-center gap-x-2 gap-y-3'
  },
  variants: {
    variant: {
      solid: {
        root: 'bg-inverted text-inverted',
        title: 'text-inverted',
        description: 'text-dimmed'
      },
      outline: {
        root: 'bg-default ring ring-default',
        description: 'text-muted'
      },
      soft: {
        root: 'bg-elevated/50',
        description: 'text-toned'
      },
      subtle: {
        root: 'bg-elevated/50 ring ring-default',
        description: 'text-toned'
      },
      ghost: {
        description: 'text-muted'
      }
    }
  },
  defaultVariants: {
    variant: 'subtle'
  }
}
