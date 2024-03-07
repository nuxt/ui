export default (config: any) => ({
  slots: {
    base: 'rounded-md font-medium inline-flex items-center focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 shrink-0',
    label: '',
    icon: 'shrink-0'
  },
  variants: {
    color: Object.fromEntries(config.colors.map((color: string) => [color, ''])),
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
  compoundVariants: [...config.colors.map((color: string) => ({
    color,
    variant: 'solid',
    class: `shadow-sm text-white dark:text-gray-900 bg-${color}-500 hover:bg-${color}-600 disabled:bg-${color}-500 dark:bg-${color}-400 dark:hover:bg-${color}-500 dark:disabled:bg-${color}-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${color}-500 dark:focus-visible:outline-${color}-400`
  })), ...config.colors.map((color: string) => ({
    color,
    variant: 'outline',
    class: `ring-1 ring-inset ring-current text-${color}-500 dark:text-${color}-400 hover:bg-${color}-50 disabled:bg-transparent dark:hover:bg-${color}-950 dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400`
  })), ...config.colors.map((color: string) => ({
    color,
    variant: 'soft',
    class: `text-${color}-500 dark:text-${color}-400 bg-${color}-50 hover:bg-${color}-100 disabled:bg-${color}-50 dark:bg-${color}-950 dark:hover:bg-${color}-900 dark:disabled:bg-${color}-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400`
  })), ...config.colors.map((color: string) => ({
    color,
    variant: 'ghost',
    class: `text-${color}-500 dark:text-${color}-400 hover:bg-${color}-50 disabled:bg-transparent dark:hover:bg-${color}-950 dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400`
  })), ...config.colors.map((color: string) => ({
    color,
    variant: 'link',
    class: `text-${color}-500 hover:text-${color}-600 disabled:text-${color}-500 dark:text-${color}-400 dark:hover:text-${color}-500 dark:disabled:text-${color}-400 underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400`
  })), {
    color: 'white',
    variant: 'solid',
    class: 'shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400'
  }, {
    color: 'white',
    variant: 'ghost',
    class: 'text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400'
  }, {
    color: 'gray',
    variant: 'solid',
    class: 'shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:disabled:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400'
  }, {
    color: 'gray',
    variant: 'ghost',
    class: 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400'
  }, {
    color: 'gray',
    variant: 'link',
    class: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline-offset-4 hover:underline focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400'
  }, {
    color: 'black',
    variant: 'solid',
    class: 'shadow-sm text-white dark:text-gray-900 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 dark:disabled:bg-white focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400'
  }, {
    color: 'black',
    variant: 'link',
    class: 'text-gray-900 dark:text-white underline-offset-4 hover:underline focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400'
  }, {
    size: '2xs',
    square: true,
    class: {
      base: 'p-1'
    }
  }, {
    size: 'xs',
    square: true,
    class: {
      base: 'p-1'
    }
  }, {
    size: 'sm',
    square: true,
    class: {
      base: 'p-1'
    }
  }, {
    size: 'md',
    square: true,
    class: {
      base: 'p-2'
    }
  }, {
    size: 'lg',
    square: true,
    class: {
      base: 'p-2'
    }
  }, {
    size: 'xl',
    square: true,
    class: {
      base: 'p-2'
    }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'sm'
  }
})