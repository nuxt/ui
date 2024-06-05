export default (config: { colors: string[] }) => ({
  slots: {
    root: 'flex items-center gap-2',
    list: 'relative flex p-1 group',
    indicator: 'absolute transition-[translate,width] duration-200',
    trigger: 'relative inline-flex items-center justify-center gap-1.5 shrink-0 px-3 py-1.5 data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-gray-400 hover:data-[state=inactive]:text-gray-700 dark:hover:data-[state=inactive]:text-gray-200 text-sm font-medium rounded-md disabled:cursor-not-allowed disabled:opacity-75 transition-colors ease-out focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 focus:outline-none',
    content: 'focus:outline-none w-full',
    leadingIcon: 'shrink-0 size-5',
    leadingAvatar: 'shrink-0',
    label: 'truncate'
  },
  variants: {
    color: {
      ...Object.fromEntries(config.colors.map((color: string) => [color, ''])),
      white: '',
      black: ''
    },
    variant: {
      pill: {
        list: 'bg-gray-50 dark:bg-gray-800 rounded-lg',
        trigger: 'flex-1',
        indicator: 'rounded-md shadow-sm'
      },
      link: {
        list: 'border-gray-200 dark:border-gray-800',
        indicator: 'rounded-full'
      }
    },
    orientation: {
      horizontal: {
        root: 'flex-col',
        list: 'w-full',
        indicator: 'left-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position]'
      },
      vertical: {
        list: 'flex-col items-center',
        indicator: 'top-0 h-[--radix-tabs-indicator-size] translate-y-[--radix-tabs-indicator-position]'
      }
    }
  },
  compoundVariants: [{
    orientation: 'horizontal',
    variant: 'pill',
    class: {
      indicator: 'inset-y-1'
    }
  }, {
    orientation: 'horizontal',
    variant: 'link',
    class: {
      list: 'border-b',
      indicator: '-bottom-px h-px'
    }
  }, {
    orientation: 'vertical',
    variant: 'pill',
    class: {
      indicator: 'inset-x-1'
    }
  }, {
    orientation: 'vertical',
    variant: 'link',
    class: {
      list: 'border-l',
      indicator: '-left-px w-px'
    }
  }, ...config.colors.map((color: string) => ({
    color,
    variant: 'pill',
    class: {
      indicator: `bg-${color}-500 dark:bg-${color}-400`,
      trigger: 'data-[state=active]:text-white'
    }
  })), {
    color: 'white',
    variant: 'pill',
    class: {
      indicator: 'bg-white dark:bg-gray-900',
      trigger: 'data-[state=active]:text-gray-900 dark:data-[state=active]:text-white'
    }
  }, {
    color: 'black',
    variant: 'pill',
    class: {
      indicator: 'bg-gray-900 dark:bg-white',
      trigger: 'data-[state=active]:text-white dark:data-[state=active]:text-gray-900'
    }
  }, ...config.colors.map((color: string) => ({
    color,
    variant: 'link',
    class: {
      indicator: `bg-${color}-500 dark:bg-${color}-400`,
      trigger: `data-[state=active]:text-${color}-500 dark:data-[state=active]:text-${color}-400`
    }
  })), {
    color: ['white', 'black'],
    variant: 'link',
    class: {
      indicator: 'bg-gray-900 dark:bg-white',
      trigger: 'data-[state=active]:text-gray-900 dark:data-[state=active]:text-white'
    }
  }],
  defaultVariants: {
    color: 'white',
    variant: 'pill'
  }
})
