import { colorVariant } from './color'
import { fieldGroupVariant } from './field-group'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    base: 'rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-(--ui-disabled-opacity) aria-disabled:opacity-(--ui-disabled-opacity) transition-colors outline-accent-focus focus-visible:outline-(length:--ui-focus-width)',
    label: 'truncate',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    trailingIcon: 'shrink-0'
  },
  variants: {
    ...fieldGroupVariant,
    color: colorVariant({ base: '' }),
    variant: {
      solid: {
        base: 'text-accent-contrast bg-accent hover:bg-accent-hover active:bg-accent-hover disabled:bg-accent aria-disabled:bg-accent'
      },
      outline: {
        base: 'ring ring-inset ring-accent-strong text-accent-default bg-default hover:bg-accent-soft active:bg-accent-soft disabled:bg-default aria-disabled:bg-default focus-visible:ring-accent'
      },
      soft: {
        base: 'text-accent-default bg-accent-soft hover:bg-accent-strong active:bg-accent-strong disabled:bg-accent-soft aria-disabled:bg-accent-soft'
      },
      subtle: {
        base: 'text-accent-default ring ring-inset ring-accent-strong bg-accent-soft hover:bg-accent-strong active:bg-accent-strong disabled:bg-accent-soft aria-disabled:bg-accent-soft focus-visible:ring-accent'
      },
      ghost: {
        base: 'text-accent-default hover:bg-accent-soft active:bg-accent-soft disabled:bg-transparent aria-disabled:bg-transparent'
      },
      link: {
        base: 'text-accent-muted hover:text-accent-default active:text-accent-default disabled:text-accent-muted aria-disabled:text-accent-muted'
      }
    },
    size: {
      xs: {
        base: '[--ui-control-px:var(--ui-control-px-xs)] [--ui-control-py:var(--ui-control-py-xs)] [--ui-control-gap:var(--ui-control-gap-xs)] [--ui-control-icon-size:var(--ui-control-icon-size-xs)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-(length:--ui-control-text-xs)/(--ui-control-text-xs--line-height)',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)'
      },
      sm: {
        base: '[--ui-control-px:var(--ui-control-px-sm)] [--ui-control-py:var(--ui-control-py-sm)] [--ui-control-gap:var(--ui-control-gap-sm)] [--ui-control-icon-size:var(--ui-control-icon-size-sm)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-(length:--ui-control-text-sm)/(--ui-control-text-sm--line-height)',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)'
      },
      md: {
        base: '[--ui-control-px:var(--ui-control-px-md)] [--ui-control-py:var(--ui-control-py-md)] [--ui-control-gap:var(--ui-control-gap-md)] [--ui-control-icon-size:var(--ui-control-icon-size-md)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-(length:--ui-control-text-md)/(--ui-control-text-md--line-height)',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)'
      },
      lg: {
        base: '[--ui-control-px:var(--ui-control-px-lg)] [--ui-control-py:var(--ui-control-py-lg)] [--ui-control-gap:var(--ui-control-gap-lg)] [--ui-control-icon-size:var(--ui-control-icon-size-lg)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-(length:--ui-control-text-lg)/(--ui-control-text-lg--line-height)',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)'
      },
      xl: {
        base: '[--ui-control-px:var(--ui-control-px-xl)] [--ui-control-py:var(--ui-control-py-xl)] [--ui-control-gap:var(--ui-control-gap-xl)] [--ui-control-icon-size:var(--ui-control-icon-size-xl)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-(length:--ui-control-text-xl)/(--ui-control-text-xl--line-height)',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)'
      }
    },
    block: {
      true: {
        base: 'w-full justify-center',
        trailingIcon: 'ms-auto'
      }
    },
    // An icon is denser than text, so the side it's on takes 2px less padding
    leading: {
      true: {
        base: 'ps-[calc(var(--ui-control-px)-(--spacing(0.5)))]'
      }
    },
    trailing: {
      true: {
        base: 'pe-[calc(var(--ui-control-px)-(--spacing(0.5)))]'
      }
    },
    // Equal padding, for `square` or an icon and nothing else. After `leading`
    // and `trailing`, so it replaces their padding
    square: {
      true: {
        base: 'px-(--ui-control-py)'
      }
    },
    // The component turns it off on the trailing icon when the leading one is the loading icon
    loading: {
      true: {
        leadingIcon: 'animate-spin',
        trailingIcon: 'animate-spin'
      }
    },
    active: {
      true: {
        base: ''
      },
      false: {
        base: ''
      }
    }
  },
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
})
