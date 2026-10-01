import { colorVariant } from './color'
import { fieldGroupVariant } from './field-group'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    base: 'rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors outline-accent-focus focus-visible:outline-3',
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
        base: 'text-accent-default hover:bg-accent-soft active:bg-accent-soft disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent'
      },
      link: {
        base: 'text-accent-muted hover:text-accent-default active:text-accent-default disabled:text-accent-muted aria-disabled:text-accent-muted'
      }
    },
    size: {
      xs: {
        base: 'px-2 py-1 text-xs gap-1',
        leadingIcon: 'size-4',
        trailingIcon: 'size-4'
      },
      sm: {
        base: 'px-2.5 py-1.5 text-xs gap-1.5',
        leadingIcon: 'size-4',
        trailingIcon: 'size-4'
      },
      md: {
        base: 'px-2.5 py-1.5 text-sm gap-1.5',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5'
      },
      lg: {
        base: 'px-3 py-2 text-sm gap-2',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5'
      },
      xl: {
        base: 'px-3 py-2 text-base gap-2',
        leadingIcon: 'size-6',
        trailingIcon: 'size-6'
      }
    },
    block: {
      true: {
        base: 'w-full justify-center',
        trailingIcon: 'ms-auto'
      }
    },
    square: {
      true: ''
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
    size: 'xs',
    square: true,
    class: { base: 'p-1' }
  }, {
    size: 'sm',
    square: true,
    class: { base: 'p-1.5' }
  }, {
    size: 'md',
    square: true,
    class: { base: 'p-1.5' }
  }, {
    size: 'lg',
    square: true,
    class: { base: 'p-2' }
  }, {
    size: 'xl',
    square: true,
    class: { base: 'p-2' }
  }, {
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
