import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex items-center gap-2',
    list: 'relative flex p-1 group',
    indicator: 'absolute transition-[translate,width] duration-200',
    trigger: ['relative inline-flex items-center justify-center shrink-0 data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-gray-400 hover:data-[state=inactive]:text-gray-700 dark:hover:data-[state=inactive]:text-gray-200 font-medium rounded-md disabled:cursor-not-allowed disabled:opacity-75 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 focus:outline-none', options.transitions && 'transition-colors'],
    content: 'focus:outline-none w-full',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    leadingAvatarSize: '',
    label: 'truncate'
  },
  variants: {
    color: {
      ...Object.fromEntries(options.colors.map((color: string) => [color, ''])),
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
    },
    size: {
      xs: {
        trigger: 'px-2 py-1 text-xs gap-1',
        leadingIcon: 'size-4',
        leadingAvatarSize: '3xs'
      },
      sm: {
        trigger: 'px-2.5 py-1.5 text-xs gap-1.5',
        leadingIcon: 'size-4',
        leadingAvatarSize: '3xs'
      },
      md: {
        trigger: 'px-3 py-1.5 text-sm gap-1.5',
        leadingIcon: 'size-5',
        leadingAvatarSize: '2xs'
      },
      lg: {
        trigger: 'px-3 py-2 text-sm gap-2',
        leadingIcon: 'size-5',
        leadingAvatarSize: '2xs'
      },
      xl: {
        trigger: 'px-3 py-2 text-base gap-2',
        leadingIcon: 'size-6',
        leadingAvatarSize: 'xs'
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
  }, ...options.colors.map((color: string) => ({
    color,
    variant: 'pill',
    class: {
      indicator: `bg-${color}-500 dark:bg-${color}-400`,
      trigger: 'data-[state=active]:text-white dark:data-[state=active]:text-gray-900'
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
  }, ...options.colors.map((color: string) => ({
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
    variant: 'pill',
    size: 'md'
  }
})
