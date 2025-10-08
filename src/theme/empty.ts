export default {
  slots: {
    root: 'relative isolate rounded-lg',
    container: 'flex flex-col items-center gap-6 p-4 sm:p-6',
    content: 'mx-auto',
    wrapper: 'max-w-sm flex flex-col items-center gap-y-2 text-center',
    icon: 'size-8',
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
      },
      naked: {
        container: 'p-0 sm:p-0',
        description: 'text-muted'
      }
    },
    content: {
      default: '',
      icon: ''
    }
  },
  defaultVariants: {
    variant: 'subtle',
    content: 'icon'
  }
}
