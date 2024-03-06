export default {
  slots: {
    base: 'rounded-md font-medium inline-flex items-center focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0',
    label: '',
    icon: 'flex-shrink-0'
  },
  variants: {
    color: {
      blue: 'bg-blue-500 hover:bg-blue-700',
      red: 'bg-red-500 hover:bg-red-700',
      green: 'bg-green-500 hover:bg-green-700'
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
      true: {
        base: 'w-full justify-center'
      }
    },
    square: {
      true: {
        base: ''
      }
    },
    padded: {
      true: {
        base: 'p-0'
      }
    }
  },
  compoundVariants: [{
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
    color: 'blue' as const,
    size: 'md' as const
  }
}