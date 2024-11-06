export default {
  wrapper: 'w-full flex flex-col gap-2',
  indicator: {
    container: 'min-w-fit transition-all',
    text: 'text-gray-400 dark:text-gray-500 text-end',
    size: {
      '2xs': 'text-xs',
      'xs': 'text-xs',
      'sm': 'text-sm',
      'md': 'text-sm',
      'lg': 'text-sm',
      'xl': 'text-base',
      '2xl': 'text-base'
    }
  },
  meter: {
    base: 'appearance-none block w-full bg-none overflow-y-hidden',
    background: 'bg-gray-200 dark:bg-gray-700',
    color: 'text-{color}-500 dark:text-{color}-400',
    ring: '',
    rounded: 'rounded-full',
    shadow: '',
    size: {
      '2xs': 'h-px',
      'xs': 'h-0.5',
      'sm': 'h-1',
      'md': 'h-2',
      'lg': 'h-3',
      'xl': 'h-4',
      '2xl': 'h-5'
    },
    appearance: {
      inner: '[&::-webkit-meter-inner-element]:block [&::-webkit-meter-inner-element]:relative [&::-webkit-meter-inner-element]:border-none [&::-webkit-meter-inner-element]:bg-none [&::-webkit-meter-inner-element]:bg-transparent',
      meter: '[&::-webkit-meter-bar]:border-none [&::-webkit-meter-bar]:bg-none [&::-webkit-meter-bar]:bg-transparent',
      bar: '[&::-webkit-meter-optimum-value]:border-none [&::-webkit-meter-optimum-value]:bg-none [&::-webkit-meter-optimum-value]:bg-current',
      value: '[&::-moz-meter-bar]:border-none [&::-moz-meter-bar]:bg-none [&::-moz-meter-bar]:bg-current'
    },
    bar: {
      transition: '[&::-webkit-meter-optimum-value]:transition-all [&::-moz-meter-bar]:transition-all',
      ring: '',
      rounded: '[&::-webkit-meter-optimum-value]:rounded-full [&::-moz-meter-bar]:rounded-full',
      size: {
        '2xs': '[&::-webkit-meter-optimum-value]:h-px [&::-moz-meter-bar]:h-px',
        'xs': '[&::-webkit-meter-optimum-value]:h-0.5 [&::-moz-meter-bar]:h-0.5',
        'sm': '[&::-webkit-meter-optimum-value]:h-1 [&::-moz-meter-bar]:h-1',
        'md': '[&::-webkit-meter-optimum-value]:h-2 [&::-moz-meter-bar]:h-2',
        'lg': '[&::-webkit-meter-optimum-value]:h-3 [&::-moz-meter-bar]:h-3',
        'xl': '[&::-webkit-meter-optimum-value]:h-4 [&::-moz-meter-bar]:h-4',
        '2xl': '[&::-webkit-meter-optimum-value]:h-5 [&::-moz-meter-bar]:h-5'
      }
    }
  },
  label: {
    base: 'flex gap-2 items-center',
    text: 'truncate',
    color: 'text-{color}-500 dark:text-{color}-400',
    size: {
      '2xs': 'text-xs',
      'xs': 'text-xs',
      'sm': 'text-sm',
      'md': 'text-sm',
      'lg': 'text-sm',
      'xl': 'text-base',
      '2xl': 'text-base'
    }
  },
  color: {
    white: 'text-white dark:text-black',
    black: 'text-black dark:text-white',
    gray: 'text-gray-500 dark:text-gray-400'
  },
  default: {
    size: 'md',
    color: 'primary'
  }
}
