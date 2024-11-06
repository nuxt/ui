export default {
  wrapper: 'w-full flex flex-col gap-2',
  indicator: {
    container: {
      base: 'flex flex-row justify-end',
      width: 'min-w-fit',
      transition: 'transition-all'
    },
    align: 'text-end',
    width: 'w-fit',
    color: 'text-gray-400 dark:text-gray-500',
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
  progress: {
    base: 'block appearance-none border-none overflow-hidden',
    width: 'w-full [&::-webkit-progress-bar]:w-full',
    size: {
      '2xs': 'h-px',
      'xs': 'h-0.5',
      'sm': 'h-1',
      'md': 'h-2',
      'lg': 'h-3',
      'xl': 'h-4',
      '2xl': 'h-5'
    },
    rounded: 'rounded-full [&::-webkit-progress-bar]:rounded-full',
    track: '[&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-bar]:dark:bg-gray-700 [@supports(selector(&::-moz-progress-bar))]:bg-gray-200 [@supports(selector(&::-moz-progress-bar))]:dark:bg-gray-700',
    bar: '[&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:ease-in-out [&::-moz-progress-bar]:rounded-full',
    color: 'text-{color}-500 dark:text-{color}-400',
    background: '[&::-webkit-progress-value]:bg-current [&::-moz-progress-bar]:bg-current',
    indeterminate: {
      base: 'indeterminate:relative',
      rounded: 'indeterminate:after:rounded-full [&:indeterminate::-webkit-progress-value]:rounded-full [&:indeterminate::-moz-progress-bar]:rounded-full'
    }
  },
  steps: {
    base: 'grid grid-cols-1',
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
  step: {
    base: 'transition-all opacity-0 truncate row-start-1 col-start-1',
    align: 'text-end',
    active: 'opacity-100',
    first: 'text-gray-500 dark:text-gray-400'
  },
  animation: {
    'carousel': 'bar-animation-carousel',
    'carousel-inverse': 'bar-animation-carousel-inverse',
    'swing': 'bar-animation-swing',
    'elastic': 'bar-animation-elastic'
  },
  default: {
    color: 'primary',
    size: 'md',
    animation: 'carousel'
  }
}
