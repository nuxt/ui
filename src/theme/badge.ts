import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  base: 'rounded-md font-medium inline-flex items-center',
  variants: {
    color: {
      ...Object.fromEntries(options.colors.map((color: string) => [color, ''])),
      white: '',
      gray: '',
      black: ''
    },
    variant: {
      solid: '',
      outline: '',
      soft: '',
      subtle: ''
    },
    size: {
      sm: 'text-xs px-1.5 py-0.5',
      md: 'text-xs px-2 py-1',
      lg: 'text-sm px-2 py-1'
    }
  },
  compoundVariants: [...options.colors.map((color: string) => ({
    color,
    variant: 'solid',
    class: `bg-${color}-500 dark:bg-${color}-400 text-white dark:text-gray-900`
  })), ...options.colors.map((color: string) => ({
    color,
    variant: 'outline',
    class: `text-${color}-500 dark:text-${color}-400 ring ring-inset ring-${color}-500 dark:ring-${color}-400`
  })), ...options.colors.map((color: string) => ({
    color,
    variant: 'soft',
    class: `bg-${color}-50 dark:bg-${color}-400/10 text-${color}-500 dark:text-${color}-400`
  })), ...options.colors.map((color: string) => ({
    color,
    variant: 'subtle',
    class: `bg-${color}-50 dark:bg-${color}-400/10 text-${color}-500 dark:text-${color}-400 ring ring-inset ring-${color}-500/25 dark:ring-${color}-400/25`
  })), {
    color: 'white',
    variant: 'solid',
    class: 'ring ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-900'
  }, {
    color: 'gray',
    variant: 'solid',
    class: 'ring ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800'
  }, {
    color: 'black',
    variant: 'solid',
    class: 'text-white dark:text-gray-900 bg-gray-900 dark:bg-white'
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
})
