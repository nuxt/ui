export default (config: { colors: string[] }) => ({
  slots: {
    root: 'relative flex items-center select-none touch-none',
    track: 'relative bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-full grow',
    range: 'absolute rounded-full',
    thumb: 'rounded-full bg-white dark:bg-gray-900 ring-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2'
  },
  variants: {
    color: Object.fromEntries(config.colors.map((color: string) => [color, {
      range: `bg-${color}-500 dark:bg-${color}-400`,
      thumb: `ring-${color}-500 dark:ring-${color}-400 focus-visible:outline-${color}-500/50 dark:focus-visible:outline-${color}-400/50`
    }])),
    size: {
      '2xs': {
        thumb: 'size-1.5'
      },
      'xs': {
        thumb: 'size-2'
      },
      'sm': {
        thumb: 'size-3'
      },
      'md': {
        thumb: 'size-4'
      },
      'lg': {
        thumb: 'size-5'
      },
      'xl': {
        thumb: 'size-6'
      }
    },
    orientation: {
      horizontal: {
        root: 'w-full',
        range: 'h-full'
      },
      vertical: {
        root: 'flex-col h-full',
        range: 'w-full'
      }
    },
    disabled: {
      true: {
        root: 'opacity-75 cursor-not-allowed'
      }
    }
  },
  compoundVariants: [{
    orientation: 'horizontal',
    size: '2xs',
    class: {
      root: 'h-1.5',
      track: 'h-px'
    }
  }, {
    orientation: 'horizontal',
    size: 'xs',
    class: {
      root: 'h-2',
      track: 'h-0.5'
    }
  }, {
    orientation: 'horizontal',
    size: 'sm',
    class: {
      root: 'h-3',
      track: 'h-1'
    }
  }, {
    orientation: 'horizontal',
    size: 'md',
    class: {
      root: 'h-4',
      track: 'h-2'
    }
  }, {
    orientation: 'horizontal',
    size: 'lg',
    class: {
      root: 'h-5',
      track: 'h-3'
    }
  }, {
    orientation: 'horizontal',
    size: 'xl',
    class: {
      root: 'h-6',
      track: 'h-4'
    }
  }, {
    orientation: 'vertical',
    size: '2xs',
    class: {
      root: 'w-1.5',
      track: 'w-px'
    }
  }, {
    orientation: 'vertical',
    size: 'xs',
    class: {
      root: 'w-2',
      track: 'w-0.5'
    }
  }, {
    orientation: 'vertical',
    size: 'sm',
    class: {
      root: 'w-3',
      track: 'w-1'
    }
  }, {
    orientation: 'vertical',
    size: 'md',
    class: {
      root: 'w-4',
      track: 'w-2'
    }
  }, {
    orientation: 'vertical',
    size: 'lg',
    class: {
      root: 'w-5',
      track: 'w-3'
    }
  }, {
    orientation: 'vertical',
    size: 'xl',
    class: {
      root: 'w-6',
      track: 'w-4'
    }
  }],
  defaultVariants: {
    size: 'sm',
    color: 'primary'
  }
})
