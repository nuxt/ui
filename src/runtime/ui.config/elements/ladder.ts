export default {
  base: 'w-full flex',
  container: 'grow flex flex-items-center',
  step: 'grow space-y-1',
  indicator: 'w-full grid',
  separator: {
    wrapper: 'row-start-1 col-start-1 flex items-center',
    base: 'grow h-px w-1/2',
    color: 'bg-gray-200 dark:bg-gray-700',
    shadow: ''
  },
  icon: {
    wrapper: 'row-start-1 col-start-1 flex justify-center',
    base: 'flex items-center justify-center transition-all disabled:cursor-not-allowed',
    rounded: 'rounded-full',
    ring: '',
    shadow: '',
    size: 'text-md h-8 w-8',
    active: {
      background: 'bg-{color}-500 dark:bg-{color}-500',
      ring: '',
      color: '',
      shadow: ''
    },
    inactive: {
      background: 'bg-{color}-200 dark:bg-{color}-700',
      ring: '',
      color: '',
      shadow: ''
    }
  },
  label: {
    base: 'px-2 text-center truncate transition-colors',
    size: 'text-md',
    active: 'text-{color}-500',
    inactive: 'text-{color}-500'
  },
  colors: {
    gray: ''
  },
  default: {
    size: 'md',
    color: 'primary',
    inactiveColor: 'gray'
  }
}
