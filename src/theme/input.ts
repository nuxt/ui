export default (config: { colors: string[] }) => {
  return {
    slots: {
      root: 'relative',
      base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 rounded-md placeholder-gray-400 dark:placeholder-gray-500',
      leading: 'absolute inset-y-0 start-0 flex items-center',
      leadingIcon: 'shrink-0 text-gray-400 dark:text-gray-500',
      trailing: 'absolute inset-y-0 end-0 flex items-center',
      trailingIcon: 'shrink-0 text-gray-400 dark:text-gray-500'
    },
    variants: {
      size: {
        '2xs': {
          base: 'text-xs gap-x-1 px-2 py-1',
          leading: 'px-2',
          trailing: 'px-2',
          leadingIcon: 'size-4',
          trailingIcon: 'size-4'
        },
        xs: {
          base: 'text-sm gap-x-1.5 px-2.5 py-1.5',
          leading: 'px-2.5',
          trailing: 'px-2.5',
          leadingIcon: 'size-4',
          trailingIcon: 'size-4'
        },
        sm: {
          base: 'text-sm gap-x-1.5 px-2.5 py-1.5',
          leading: 'px-2.5',
          trailing: 'px-2.5',
          leadingIcon: 'size-5',
          trailingIcon: 'size-5'
        },
        md: {
          base: 'text-sm gap-x-1.5 px-3 py-2',
          leading: 'px-3',
          trailing: 'px-3',
          leadingIcon: 'size-5',
          trailingIcon: 'size-5'
        },
        lg: {
          base: 'text-sm gap-x-2.5 px-3.5 py-2.5',
          leading: 'px-3.5',
          trailing: 'px-3.5',
          leadingIcon: 'size-5',
          trailingIcon: 'size-5'
        },
        xl: {
          base: 'text-base gap-x-2.5 px-3.5 py-2.5',
          leading: 'px-3.5',
          trailing: 'px-3.5',
          leadingIcon: 'size-6',
          trailingIcon: 'size-6'
        }
      },
      variant: {
        outline: '',
        none: 'bg-transparent focus:ring-0 focus:shadow-none'
      },
      color: {
        ...Object.fromEntries(config.colors.map((color: string) => [color, ''])),
        white: '',
        gray: ''
      },
      leading: {
        true: ''
      },
      trailing: {
        true: ''
      },
      loading: {
        true: ''
      }
    },
    compoundVariants: [...config.colors.map((color: string) => ({
      color,
      variant: 'outline',
      class: `shadow-sm bg-transparent text-gray-900 dark:text-white ring ring-inset ring-${color}-500 dark:ring-${color}-400 focus:ring-2 focus:ring-${color}-500 dark:focus:ring-${color}-400`
    })), {
      color: 'white',
      variant: 'outline',
      class: 'shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
    }, {
      color: 'gray',
      variant: 'outline',
      class: 'shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ring ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
    }, {
      leading: true,
      size: '2xs',
      class: 'ps-7'
    }, {
      leading: true,
      size: 'xs',
      class: 'ps-8'
    }, {
      leading: true,
      size: 'sm',
      class: 'ps-9'
    }, {
      leading: true,
      size: 'md',
      class: 'ps-10'
    }, {
      leading: true,
      size: 'lg',
      class: 'ps-11'
    }, {
      leading: true,
      size: 'xl',
      class: 'ps-12'
    }, {
      trailing: true,
      size: '2xs',
      class: 'pe-7'
    }, {
      trailing: true,
      size: 'xs',
      class: 'pe-8'
    }, {
      trailing: true,
      size: 'sm',
      class: 'pe-9'
    }, {
      trailing: true,
      size: 'md',
      class: 'pe-10'
    }, {
      trailing: true,
      size: 'lg',
      class: 'pe-11'
    }, {
      trailing: true,
      size: 'xl',
      class: 'pe-12'
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
      size: 'sm',
      color: 'white',
      variant: 'outline'
    }
  }
}
