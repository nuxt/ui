export default (config: { colors: string[] }) => ({
  slots: {
    root: 'flex items-center align-center text-center',
    border: '',
    container: 'font-medium text-gray-700 dark:text-gray-200 flex',
    icon: 'shrink-0 size-5',
    avatar: 'shrink-0',
    label: 'text-sm'
  },
  variants: {
    color: {
      ...Object.fromEntries(config.colors.map((color: string) => [color, { border: `border-${color}-500 dark:border-${color}-400` }])),
      white: { border: 'border-white dark:border-gray-900' },
      gray: { border: 'border-gray-200 dark:border-gray-800' },
      black: { border: 'border-gray-900 dark:border-white' }
    },
    orientation: {
      horizontal: {
        root: 'w-full flex-row',
        border: 'w-full',
        container: 'mx-3 whitespace-nowrap'
      },
      vertical: {
        root: 'h-full flex-col',
        border: 'h-full',
        container: 'my-2'
      }
    },
    size: {
      '2xs': '',
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: ''
    },
    type: {
      solid: {
        border: 'border-solid'
      },
      dashed: {
        border: 'border-dashed'
      },
      dotted: {
        border: 'border-dotted'
      }
    }
  },
  compoundVariants: [{
    orientation: 'horizontal',
    size: '2xs',
    class: { border: 'border-t' }
  }, {
    orientation: 'horizontal',
    size: 'xs',
    class: { border: 'border-t-[2px]' }
  }, {
    orientation: 'horizontal',
    size: 'sm',
    class: { border: 'border-t-[3px]' }
  }, {
    orientation: 'horizontal',
    size: 'md',
    class: { border: 'border-t-[4px]' }
  }, {
    orientation: 'horizontal',
    size: 'lg',
    class: { border: 'border-t-[5px]' }
  }, {
    orientation: 'horizontal',
    size: 'xl',
    class: { border: 'border-t-[6px]' }
  }, {
    orientation: 'vertical',
    size: '2xs',
    class: { border: 'border-s' }
  }, {
    orientation: 'vertical',
    size: 'xs',
    class: { border: 'border-s-[2px]' }
  }, {
    orientation: 'vertical',
    size: 'sm',
    class: { border: 'border-s-[3px]' }
  }, {
    orientation: 'vertical',
    size: 'md',
    class: { border: 'border-s-[4px]' }
  }, {
    orientation: 'vertical',
    size: 'lg',
    class: { border: 'border-s-[5px]' }
  }, {
    orientation: 'vertical',
    size: 'xl',
    class: { border: 'border-s-[6px]' }
  }],
  defaultVariants: {
    color: 'gray',
    size: '2xs',
    type: 'solid'
  }
})
