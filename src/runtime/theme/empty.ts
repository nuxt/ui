import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative flex flex-col items-center justify-center gap-4 rounded-lg p-4 sm:p-6 lg:p-8 min-w-0',
    header: 'flex flex-col items-center gap-2 max-w-sm text-center',
    avatar: 'shrink-0 mb-2',
    title: 'text-strong text-pretty font-medium',
    description: 'text-balance text-center',
    body: 'flex flex-col items-center gap-4 max-w-sm',
    actions: 'flex flex-wrap justify-center gap-2 shrink-0',
    footer: 'flex flex-col items-center gap-2 max-w-sm'
  },
  variants: {
    size: {
      xs: {
        avatar: '[--ui-control-size:--spacing(8)] text-base',
        title: 'text-sm',
        description: 'text-xs'
      },
      sm: {
        avatar: '[--ui-control-size:--spacing(9)] text-lg',
        title: 'text-sm',
        description: 'text-xs'
      },
      md: {
        avatar: '[--ui-control-size:--spacing(10)] text-xl',
        title: 'text-base',
        description: 'text-sm'
      },
      lg: {
        avatar: '[--ui-control-size:--spacing(11)] text-[22px]',
        title: 'text-base',
        description: 'text-sm'
      },
      xl: {
        avatar: '[--ui-control-size:--spacing(12)] text-2xl',
        title: 'text-lg',
        description: 'text-base'
      }
    },
    variant: {
      solid: {
        root: 'bg-neutral',
        title: 'text-contrast',
        description: 'text-faint'
      },
      outline: {
        root: 'bg-default ring ring-default',
        description: 'text-muted'
      },
      soft: {
        root: 'bg-tint',
        description: 'text-default'
      },
      subtle: {
        root: 'bg-tint ring ring-default',
        description: 'text-default'
      },
      naked: {
        description: 'text-muted'
      }
    },
    loading: {
      true: {
        avatar: '*:data-[slot=avatar-icon]:animate-spin'
      }
    }
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md'
  }
})
