import type { NuxtOptions } from '@nuxt/schema'

export default (options: Required<NuxtOptions['ui']>) => ({
  slots: {
    root: 'relative flex rounded-lg',
    spotlight: 'absolute inset-0 rounded-[inherit] pointer-events-none bg-default/90',
    container: 'relative flex flex-col flex-1 lg:grid gap-x-8 gap-y-4 p-4 sm:p-6',
    wrapper: 'flex flex-col flex-1 items-start',
    header: 'mb-4',
    body: 'flex-1',
    footer: 'pt-4 mt-auto',
    leading: 'inline-flex items-center mb-2.5',
    leadingIcon: 'size-5 shrink-0 text-primary',
    title: 'text-base text-pretty font-semibold text-highlighted',
    description: 'text-[15px] text-pretty'
  },
  variants: {
    orientation: {
      horizontal: {
        container: 'lg:grid-cols-2 lg:items-center'
      },
      vertical: {
        container: ''
      }
    },
    reverse: {
      true: {
        wrapper: 'lg:order-last'
      }
    },
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
    to: {
      true: {
        root: [options.theme.transitions && 'transition']
      }
    },
    title: {
      true: {
        description: 'mt-1'
      }
    },
    highlight: {
      true: {
        root: 'ring-2'
      }
    },
    highlightColor: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    spotlight: {
      true: {
        root: '[--spotlight-size:400px] before:absolute before:-inset-px before:pointer-events-none before:rounded-[inherit] before:bg-[radial-gradient(var(--spotlight-size)_var(--spotlight-size)_at_calc(var(--spotlight-x,0px))_calc(var(--spotlight-y,0px)),var(--spotlight-color),transparent_70%)]'
      }
    },
    spotlightColor: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    }
  },
  compoundVariants: [{
    variant: 'solid',
    to: true,
    class: {
      root: 'hover:bg-inverted/90'
    }
  }, {
    variant: 'outline',
    to: true,
    class: {
      root: 'hover:bg-elevated/50'
    }
  }, {
    variant: 'soft',
    to: true,
    class: {
      root: 'hover:bg-elevated'
    }
  }, {
    variant: 'subtle',
    to: true,
    class: {
      root: 'hover:bg-elevated'
    }
  }, {
    variant: 'subtle',
    to: true,
    highlight: false,
    class: {
      root: 'hover:ring-accented'
    }
  }, {
    variant: 'ghost',
    to: true,
    class: {
      root: 'hover:bg-elevated/50'
    }
  }, ...(options.theme.colors || []).map((highlightColor: string) => ({
    highlightColor,
    highlight: true,
    class: {
      root: `ring-${highlightColor}`
    }
  })), {
    highlightColor: 'neutral',
    highlight: true,
    class: {
      root: 'ring-inverted'
    }
  }, ...(options.theme.colors || []).map((spotlightColor: string) => ({
    spotlightColor,
    spotlight: true,
    class: {
      root: `[--spotlight-color:var(--ui-${spotlightColor})]`
    }
  })), {
    spotlightColor: 'neutral',
    spotlight: true,
    class: {
      root: '[--spotlight-color:var(--ui-bg-inverted)]'
    }
  }, {
    to: true,
    class: {
      root: 'has-focus-visible:ring-2 has-focus-visible:ring-primary'
    }
  }],
  defaultVariants: {
    variant: 'outline',
    highlightColor: 'primary',
    spotlightColor: 'primary'
  }
})
