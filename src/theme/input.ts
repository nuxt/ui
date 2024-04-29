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
        xs: {
          base: 'text-xs px-2 py-1',
          leading: 'pl-2',
          trailing: 'pr-2',
          leadingIcon: 'size-4',
          trailingIcon: 'size-4'
        },
        sm: {
          base: 'text-sm px-2.5 py-1',
          leading: 'pl-2.5',
          trailing: 'pr-2.5',
          leadingIcon: 'size-4',
          trailingIcon: 'size-4'
        },
        md: {
          base: 'text-sm px-2.5 py-1.5',
          leading: 'pl-2.5',
          trailing: 'pr-2.5',
          leadingIcon: 'size-5',
          trailingIcon: 'size-5'
        },
        lg: {
          base: 'text-sm px-3 py-2',
          leading: 'pl-3',
          trailing: 'pr-3',
          leadingIcon: 'size-5',
          trailingIcon: 'size-5'
        },
        xl: {
          base: 'text-sm px-3.5 py-2.5',
          leading: 'pl-3.5',
          trailing: 'pr-3.5',
          leadingIcon: 'size-5',
          trailingIcon: 'size-5'
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
      },
      type: {
        file: 'file:mr-1.5 file:font-medium file:text-gray-500 dark:file:text-gray-400 file:outline-none'
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
      size: 'xs',
      class: 'pl-7'
    }, {
      leading: true,
      size: 'sm',
      class: 'pl-8'
    }, {
      leading: true,
      size: 'md',
      class: 'pl-9'
    }, {
      leading: true,
      size: 'lg',
      class: 'pl-10'
    }, {
      leading: true,
      size: 'xl',
      class: 'pl-11'
    }, {
      trailing: true,
      size: 'xs',
      class: 'pr-7'
    }, {
      trailing: true,
      size: 'sm',
      class: 'pr-8'
    }, {
      trailing: true,
      size: 'md',
      class: 'pr-9'
    }, {
      trailing: true,
      size: 'lg',
      class: 'pr-10'
    }, {
      trailing: true,
      size: 'xl',
      class: 'pr-11'
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
      color: 'white',
      variant: 'outline'
    }
  }
}
