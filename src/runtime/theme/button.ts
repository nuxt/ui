import { colorVariant } from './color'
import { fieldGroupVariant } from './field-group'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    base: 'rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors outline-accent-focus focus-visible:outline-3 px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap)',
    label: 'truncate',
    leadingIcon: 'shrink-0 size-(--ui-control-icon)',
    leadingAvatar: 'shrink-0',
    trailingIcon: 'shrink-0 size-(--ui-control-icon)'
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
        base: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)] text-xs'
      },
      sm: {
        base: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)] text-xs'
      },
      md: {
        base: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)] text-sm'
      },
      lg: {
        base: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)] text-sm'
      },
      xl: {
        base: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)] text-base'
      }
    },
    block: {
      true: {
        base: 'w-full justify-center',
        trailingIcon: 'ms-auto'
      }
    },
    // Equal padding, for `square` or an icon and nothing else
    square: {
      true: {
        base: 'px-(--ui-control-py)'
      }
    },
    leading: {
      true: ''
    },
    trailing: {
      true: ''
    },
    loading: {
      true: ''
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
  compoundVariants: [{
    loading: true,
    leading: true,
    class: {
      leadingIcon: 'animate-spin'
    }
  }, {
    loading: true,
    leading: false,
    trailing: true,
    class: {
      trailingIcon: 'animate-spin'
    }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
})
