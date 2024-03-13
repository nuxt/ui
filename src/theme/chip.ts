export default (config: { colors: string[] }) => ({
  slots: {
    root: 'relative inline-flex items-center justify-center shrink-0',
    base: 'absolute rounded-full ring ring-white dark:ring-gray-900 flex items-center justify-center text-white dark:text-gray-900 font-medium whitespace-nowrap'
  },
  variants: {
    color: {
      ...Object.fromEntries(config.colors.map((color: string) => [color, `bg-${color}-500 dark:bg-${color}-400`])),
      gray: 'bg-gray-500 dark:bg-gray-400',
      white: 'bg-white dark:bg-gray-900',
      black: 'bg-gray-900 dark:bg-white'
    },
    size: {
      '3xs': 'h-[4px] min-w-[4px] text-[4px] p-px',
      '2xs': 'h-[5px] min-w-[5px] text-[5px] p-px',
      xs: 'h-1.5 min-w-[0.375rem] text-[6px] p-px',
      sm: 'h-2 min-w-[0.5rem] text-[7px] p-0.5',
      md: 'h-2.5 min-w-[0.625rem] text-[8px] p-0.5',
      lg: 'h-3 min-w-[0.75rem] text-[10px] p-0.5',
      xl: 'h-3.5 min-w-[0.875rem] text-[11px] p-1',
      '2xl': 'h-4 min-w-[1rem] text-[12px] p-1',
      '3xl': 'h-5 min-w-[1.25rem] text-[14px] p-1'
    },
    position: {
      'top-right': 'top-0 right-0',
      'bottom-right': 'bottom-0 right-0',
      'top-left': 'top-0 left-0',
      'bottom-left': 'bottom-0 left-0'
    },
    inset: {
      false: ''
    }
  },
  compoundVariants: [{
    position: 'top-right',
    inset: false,
    class: '-translate-y-1/2 translate-x-1/2 transform'
  }, {
    position: 'bottom-right',
    inset: false,
    class: 'translate-y-1/2 translate-x-1/2 transform'
  }, {
    position: 'top-left',
    inset: false,
    class: '-translate-y-1/2 -translate-x-1/2 transform'
  }, {
    position: 'bottom-left',
    inset: false,
    class: 'translate-y-1/2 -translate-x-1/2 transform'
  }],
  defaultVariants: {
    size: 'sm',
    color: 'primary',
    position: 'top-right'
  }
})
