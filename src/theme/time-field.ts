import type { ModuleOptions } from '../module'
import { buttonGroupVariantWithRoot } from './button-group'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative inline-flex items-center border rounded-md',
    base: ['mx-0.5 focus:outline-none focus:bg-elevated rounded focus:shadow-[0_0_0_1px] focus:shadow-black data-[placeholder]:text-dimmed', options.theme.transitions && 'transition-colors'],
    leading: 'flex items-center h-full px-2',
    leadingIcon: 'shrink-0 text-dimmed',
    trailing: 'flex items-center h-full px-2',
    trailingIcon: 'shrink-0 text-dimmed'
  },
  variants: {
    ...buttonGroupVariantWithRoot,
    size: {
      xs: {
        root: 'text-xs',
        base: 'py-1 text-xs',
        leadingIcon: 'size-4',
        trailingIcon: 'size-4'
      },
      sm: {
        root: 'text-xs',
        base: 'py-1.5 text-xs',
        leadingIcon: 'size-4',
        trailingIcon: 'size-4'
      },
      md: {
        root: 'text-sm',
        base: 'py-1.5 text-sm',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5'
      },
      lg: {
        root: 'text-sm',
        base: 'py-2 text-sm',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5'
      },
      xl: {
        root: 'text-base',
        base: 'py-2 text-base',
        leadingIcon: 'size-6',
        trailingIcon: 'size-6'
      }
    },
    variant: {
      outline: {
        root: 'border-accented text-highlighted bg-default data-[invalid]:ring data-[invalid]:ring-inset data-[invalid]:ring-red-500'
      },
      soft: {
        root: 'border-transparent text-highlighted bg-elevated/50 hover:bg-elevated focus-within:bg-elevated disabled:bg-elevated/50'
      },
      subtle: {
        root: 'border-accented text-highlighted bg-elevated data-[invalid]:ring data-[invalid]:ring-inset data-[invalid]:ring-red-500'
      },
      ghost: {
        root: 'border-transparent text-highlighted bg-transparent hover:bg-elevated focus-within:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent'
      },
      none: {
        root: 'border-transparent text-highlighted bg-transparent'
      }
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
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
    highlight: {
      true: ''
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: ['outline', 'subtle'],
    class: {
      root: `data-[focus-within]:ring-2 data-[focus-within]:ring-inset data-[focus-within]:ring-${color}`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    highlight: true,
    class: {
      root: `ring ring-inset ring-${color}`
    }
  })), {
    color: 'neutral',
    variant: ['outline', 'subtle'],
    class: {
      root: 'data-[focus-within]:ring-2 data-[focus-within]:ring-inset data-[focus-within]:ring-inverted'
    }
  }, {
    color: 'neutral',
    highlight: true,
    class: {
      root: 'ring ring-inset ring-inverted'
    }
  }, {
    leading: true,
    size: 'xs',
    class: {}
  }, {
    leading: true,
    size: 'sm',
    class: {}
  }, {
    leading: true,
    size: 'md',
    class: {}
  }, {
    leading: true,
    size: 'lg',
    class: {}
  }, {
    leading: true,
    size: 'xl',
    class: {}
  }, {
    trailing: true,
    size: 'xs',
    class: {}
  }, {
    trailing: true,
    size: 'sm',
    class: {}
  }, {
    trailing: true,
    size: 'md',
    class: {}
  }, {
    trailing: true,
    size: 'lg',
    class: {}
  }, {
    trailing: true,
    size: 'xl',
    class: {}
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
    size: 'md',
    color: 'primary',
    variant: 'outline'
  }
})
