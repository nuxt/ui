export default {
  wrapper: 'relative w-full flex items-center',
  base: 'w-full absolute appearance-none cursor-pointer disabled:cursor-not-allowed disabled:bg-opacity-50 focus:outline-none peer group',
  rounded: 'rounded-lg',
  background: 'bg-transparent',
  ring: 'focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900',
  progress: {
    base: 'absolute pointer-events-none peer-disabled:bg-opacity-50',
    rounded: 'rounded-s-lg',
    background: 'bg-{color}-500 dark:bg-{color}-400',
    size: {
      '2xs': 'h-px',
      'xs': 'h-0.5',
      'sm': 'h-1',
      'md': 'h-2',
      'lg': 'h-3',
      'xl': 'h-4',
      '2xl': 'h-5'
    }
  },
  thumb: {
    base: '[&::-webkit-slider-thumb]:relative [&::-moz-range-thumb]:relative [&::-webkit-slider-thumb]:z-[1] [&::-moz-range-thumb]:z-[1] [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0',
    color: 'text-{color}-500 dark:text-{color}-400',
    background: '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:dark:bg-gray-900 [&::-moz-range-thumb]:bg-current',
    ring: '[&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-current',
    size: {
      '2xs': '[&::-webkit-slider-thumb]:h-1.5 [&::-moz-range-thumb]:h-1.5 [&::-webkit-slider-thumb]:w-1.5 [&::-moz-range-thumb]:w-1.5 [&::-webkit-slider-thumb]:mt-[-2.5px] [&::-moz-range-thumb]:mt-[-2.5px]',
      'xs': '[&::-webkit-slider-thumb]:h-2 [&::-moz-range-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-moz-range-thumb]:w-2 [&::-webkit-slider-thumb]:mt-[-3px] [&::-moz-range-thumb]:mt-[-3px]',
      'sm': '[&::-webkit-slider-thumb]:h-3 [&::-moz-range-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-moz-range-thumb]:w-3 [&::-webkit-slider-thumb]:-mt-1 [&::-moz-range-thumb]:-mt-1',
      'md': '[&::-webkit-slider-thumb]:h-4 [&::-moz-range-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-moz-range-thumb]:w-4 [&::-webkit-slider-thumb]:-mt-1 [&::-moz-range-thumb]:-mt-1',
      'lg': '[&::-webkit-slider-thumb]:h-5 [&::-moz-range-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-moz-range-thumb]:w-5 [&::-webkit-slider-thumb]:-mt-1 [&::-moz-range-thumb]:-mt-1',
      'xl': '[&::-webkit-slider-thumb]:h-6 [&::-moz-range-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-moz-range-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-1 [&::-moz-range-thumb]:-mt-1',
      '2xl': '[&::-webkit-slider-thumb]:h-7 [&::-moz-range-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-moz-range-thumb]:w-7 [&::-webkit-slider-thumb]:-mt-1 [&::-moz-range-thumb]:-mt-1'
    }
  },
  track: {
    base: '[&::-webkit-slider-runnable-track]:group-disabled:bg-opacity-50 [&::-moz-range-track]:group-disabled:bg-opacity-50',
    background: '[&::-webkit-slider-runnable-track]:bg-gray-200 [&::-moz-range-track]:bg-gray-200 [&::-webkit-slider-runnable-track]:dark:bg-gray-700 [&::-moz-range-track]:dark:bg-gray-700',
    rounded: '[&::-webkit-slider-runnable-track]:rounded-lg [&::-moz-range-track]:rounded-lg',
    size: {
      '2xs': '[&::-webkit-slider-runnable-track]:h-px [&::-moz-range-track]:h-px',
      'xs': '[&::-webkit-slider-runnable-track]:h-0.5 [&::-moz-range-track]:h-0.5',
      'sm': '[&::-webkit-slider-runnable-track]:h-1 [&::-moz-range-track]:h-1',
      'md': '[&::-webkit-slider-runnable-track]:h-2 [&::-moz-range-track]:h-2',
      'lg': '[&::-webkit-slider-runnable-track]:h-3 [&::-moz-range-track]:h-3',
      'xl': '[&::-webkit-slider-runnable-track]:h-4 [&::-moz-range-track]:h-4',
      '2xl': '[&::-webkit-slider-runnable-track]:h-5 [&::-moz-range-track]:h-5'
    }
  },
  size: {
    '2xs': 'h-1.5',
    'xs': 'h-2',
    'sm': 'h-3',
    'md': 'h-4',
    'lg': 'h-5',
    'xl': 'h-6',
    '2xl': 'h-7'
  },
  default: {
    size: 'md',
    color: 'primary'
  }
}
