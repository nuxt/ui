import { colorVariant } from './color'
import { fieldGroupVariant } from './field-group'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    base: 'rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors',
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
        base: 'text-accent-foreground bg-accent hover:bg-accent-hover active:bg-accent-hover disabled:bg-accent aria-disabled:bg-accent outline-accent-focus focus-visible:outline-3'
      },
      outline: {
        base: 'ring ring-inset ring-accent-border text-accent-soft-foreground bg-accent-surface hover:bg-accent-soft active:bg-accent-soft disabled:bg-accent-surface aria-disabled:bg-accent-surface dark:disabled:bg-accent-surface dark:aria-disabled:bg-accent-surface outline-accent-focus focus-visible:outline-3 focus-visible:ring-accent'
      },
      soft: {
        base: 'text-accent-soft-foreground bg-accent-soft hover:bg-accent-soft-hover active:bg-accent-soft-hover outline-accent-focus focus-visible:outline-3 disabled:bg-accent-soft aria-disabled:bg-accent-soft'
      },
      subtle: {
        base: 'text-accent-soft-foreground ring ring-inset ring-accent-border-soft bg-accent-soft hover:bg-accent-soft-hover active:bg-accent-soft-hover disabled:bg-accent-soft aria-disabled:bg-accent-soft outline-accent-focus focus-visible:outline-3 focus-visible:ring-accent'
      },
      ghost: {
        base: 'text-accent-soft-foreground hover:bg-accent-soft active:bg-accent-soft outline-accent-focus focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent'
      },
      link: {
        base: 'text-accent-muted hover:text-accent-muted-hover active:text-accent-muted-hover disabled:text-accent-muted aria-disabled:text-accent-muted outline-accent-focus focus-visible:outline-3'
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
