const colors = ['primary', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchia', 'pink', 'rose']

export default {
  slots: {
    base: 'rounded-md font-medium inline-flex items-center focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 shrink-0',
    label: '',
    icon: 'shrink-0'
  },
  variants: {
    color: {
      primary: '',
      red: '',
      orange: '',
      amber: '',
      yellow: '',
      lime: '',
      green: '',
      emerald: '',
      teal: '',
      cyan: '',
      sky: '',
      blue: '',
      indigo: '',
      violet: '',
      purple: '',
      fuchia: '',
      pink: '',
      rose: ''
    },
    variant: {
      solid: '',
      outline: '',
      soft: '',
      ghost: '',
      link: ''
    },
    size: {
      '2xs': {
        base: 'px-2 py-1 text-xs gap-x-1',
        icon: 'h-4 w-4'
      },
      xs: {
        base: 'px-2.5 py-1.5 text-xs gap-x-1.5',
        icon: 'h-4 w-4'
      },
      sm: {
        base: 'px-2.5 py-1.5 text-sm gap-x-1.5',
        icon: 'h-5 w-5'
      },
      md: {
        base: 'px-3 py-2 text-sm gap-x-2',
        icon: 'h-5 w-5'
      },
      lg: {
        base: 'px-3.5 py-2.5 text-sm gap-x-2.5',
        icon: 'h-6 w-6'
      },
      xl: {
        base: 'px-3.5 py-2.5 text-base gap-x-2.5',
        icon: 'h-6 w-6'
      }
    },
    truncate: {
      true: {
        label: 'truncate'
      }
    },
    loading: {
      true: {
        icon: 'animate-spin'
      }
    },
    block: {
      true: 'w-full justify-center'
    },
    square: {
      true: ''
    }
  },
  compoundVariants: [{
    color: ['primary'] as any,
    variant: 'solid' as const,
    class: { base: 'shadow-sm text-white dark:text-gray-900 bg-[--color-current-500] hover:bg-[--color-current-600] disabled:bg-[--color-current-500] dark:bg-[--color-current-400] dark:hover:bg-[--color-current-500] dark:disabled:bg-[--color-current-400] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--color-current-500] dark:focus-visible:outline-[--color-current-400]' }
  }, {
    color: colors as any,
    variant: 'outline' as const,
    class: 'ring-1 ring-inset ring-current text-[--color-current-500] dark:text-[--color-current-400] hover:bg-[--color-current-50] disabled:bg-transparent dark:hover:bg-[--color-current-950] dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-[--color-current-500] dark:focus-visible:ring-[--color-current-400]'
  }, {
    color: colors as any,
    variant: 'soft' as const,
    class: 'text-[--color-current-500] dark:text-[--color-current-400] bg-[--color-current-50] hover:bg-[--color-current-100] disabled:bg-[--color-current-50] dark:bg-[--color-current-950] dark:hover:bg-[--color-current-900] dark:disabled:bg-[--color-current-950] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[--color-current-500] dark:focus-visible:ring-[--color-current-400]'
  }, {
    color: colors as any,
    variant: 'ghost' as const,
    class: 'text-[--color-current-500] dark:text-[--color-current-400] hover:bg-[--color-current-50] disabled:bg-transparent dark:hover:bg-[--color-current-950] dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[--color-current-500] dark:focus-visible:ring-[--color-current-400]'
  }, {
    color: colors as any,
    variant: 'link' as const,
    class: 'text-[--color-current-500] hover:text-[--color-current-600] disabled:text-[--color-current-500] dark:text-[--color-current-400] dark:hover:text-[--color-current-500] dark:disabled:text-[--color-current-400] underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[--color-current-500] dark:focus-visible:ring-[--color-current-400]'
  }, {
    size: '2xs' as const,
    square: true,
    class: {
      base: 'p-1'
    }
  }, {
    size: 'xs' as const,
    square: true,
    class: {
      base: 'p-1'
    }
  }, {
    size: 'sm' as const,
    square: true,
    class: {
      base: 'p-1'
    }
  }, {
    size: 'md' as const,
    square: true,
    class: {
      base: 'p-2'
    }
  }, {
    size: 'lg' as const,
    square: true,
    class: {
      base: 'p-2'
    }
  }, {
    size: 'xl' as const,
    square: true,
    class: {
      base: 'p-2'
    }
  }],
  defaultVariants: {
    color: 'primary' as const,
    variant: 'solid' as const,
    size: 'sm' as const
  }
}