export default {
  base: 'flex items-center w-full relative',
  track: {
    background: 'bg-gray-200 dark:bg-gray-700',
    rounded: 'rounded-lg',
    cursor: 'cursor-pointer',
    disabled: 'cursor-not-allowed',
    size: {
      '2xs': 'h-px',
      xs: 'h-0.5',
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
      xl: 'h-4',
      '2xl': 'h-5'
    }
  },
  range: {
    base: 'absolute',
    background: 'bg-{color}-500 dark:bg-{color}-400',
    rounded: 'rounded-lg',
    transition: '',
    size: {
      '2xs': 'h-px',
      xs: 'h-0.5',
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
      xl: 'h-4',
      '2xl': 'h-5'
    }
  },
  thumb: {
    base: 'block absolute rounded-full -translate-x-1/2',
    transition: '',
    size: {
      '2xs': 'h-1.5 w-1.5',
      xs: 'h-2 w-2',
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6',
      '2xl': 'h-7 w-7'
    },
    left: {
      background: 'bg-gray-900',
      ring: 'ring-2 ring-{color}-400'
    },
    right: {
      background: 'bg-gray-900',
      ring: 'ring-2 ring-{color}-400'
    }
  },
  size: {
    '2xs': 'h-1.5',
    xs: 'h-2',
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-5',
    xl: 'h-6',
    '2xl': 'h-7'
  },
  default: {
    size: 'md',
    color: 'primary'
  }
}
