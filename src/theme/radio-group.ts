export default (config: { colors: string[] }) => ({
  slots: {
    root: 'relative',
    fieldset: 'flex flex-col',
    legend: 'mb-1 block font-medium text-gray-700 dark:text-gray-200',

    option: 'flex items-start',
    base: 'rounded-full ring ring-inset ring-gray-300 dark:ring-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-offset-white dark:focus-visible:outline-offset-gray-900',
    indicator: 'flex items-center justify-center size-full rounded-full after:bg-white dark:after:bg-gray-900 after:rounded-full',
    container: 'flex items-center',

    wrapper: 'ms-2',
    label: 'block font-medium text-gray-700 dark:text-gray-200',
    description: 'text-gray-500 dark:text-gray-400'
  },
  variants: {
    color: Object.fromEntries(config.colors.map((color: string) => [
      color, {
        base: `focus-visible:outline-${color}-500 dark:focus-visible:outline-${color}-400`,
        indicator: `bg-${color}-500 dark:bg-${color}-400`
      }
    ])),

    size: {
      '2xs': {
        fieldset: 'gap-0.5',
        base: 'size-3',
        option: 'text-xs',
        container: 'h-4',
        indicator: 'after:size-1'
      },
      xs: {
        fieldset: 'gap-0.5',
        base: 'size-3.5',
        option: 'text-xs',
        container: 'h-4',
        indicator: 'after:size-1'
      },
      sm: {
        fieldset: 'gap-1',
        base: 'size-4',
        option: 'text-sm',
        container: 'h-5',
        indicator: 'after:size-1.5'
      },
      md: {
        fieldset: 'gap-1',
        base: 'size-[18px]',
        option: 'text-sm',
        container: 'h-5',
        indicator: 'after:size-1.5'
      },
      lg: {
        fieldset: 'gap-1.5',
        base: 'size-5',
        option: 'text-base',
        container: 'h-6',
        indicator: 'after:size-2'
      },
      xl: {
        fieldset: 'gap-1.5',
        base: 'size-[22px]',
        option: 'text-base',
        container: 'h-6',
        indicator: 'after:size-2'
      }
    },

    disabled: {
      true: {
        base: 'cursor-not-allowed opacity-75',
        label: 'cursor-not-allowed opacity-75'
      }
    },

    required: {
      true: {
        legend: 'after:content-[\'*\'] after:ms-0.5 after:text-red-500 dark:after:text-red-400'
      }
    }
  },

  defaultVariants: {
    size: 'sm',
    color: 'primary'
  }
})
