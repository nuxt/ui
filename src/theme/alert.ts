import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative overflow-hidden w-full rounded-lg p-4 flex gap-2.5',
    wrapper: 'min-w-0 flex-1 flex flex-col gap-1',
    title: 'text-sm font-medium',
    description: 'text-sm',
    icon: 'shrink-0 size-5',
    avatar: 'shrink-0',
    actions: 'flex gap-1.5 shrink-0',
    close: 'p-0'
  },
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
    multiline: {
      true: {
        root: 'items-start',
        actions: 'items-start mt-1'
      },
      false: {
        root: 'items-center',
        actions: 'items-center'
      }
    }
  },
  compoundVariants: [...options.colors.map((color: string) => ({
    color,
    variant: 'solid',
    class: {
      root: `bg-${color}-500 dark:bg-${color}-400 text-white dark:text-gray-900`
    }
  })), ...options.colors.map((color: string) => ({
    color,
    variant: 'outline',
    class: {
      root: `text-${color}-500 dark:text-${color}-400 ring ring-inset ring-${color}-500 dark:ring-${color}-400`
    }
  })), ...options.colors.map((color: string) => ({
    color,
    variant: 'soft',
    class: {
      root: `bg-${color}-50 dark:bg-${color}-400/10 text-${color}-500 dark:text-${color}-400`
    }
  })), ...options.colors.map((color: string) => ({
    color,
    variant: 'subtle',
    class: {
      root: `bg-${color}-50 dark:bg-${color}-400/10 text-${color}-500 dark:text-${color}-400 ring ring-inset ring-${color}-500/25 dark:ring-${color}-400/25`
    }
  })), {
    color: 'white',
    variant: 'solid',
    class: {
      root: 'ring ring-inset ring-gray-200 dark:ring-gray-800 text-gray-900 dark:text-white bg-white dark:bg-gray-900'
    }
  }, {
    color: 'gray',
    variant: 'solid',
    class: {
      root: 'ring ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800'
    }
  }, {
    color: 'black',
    variant: 'solid',
    class: {
      root: 'text-white dark:text-gray-900 bg-gray-900 dark:bg-white'
    }
  }],
  defaultVariants: {
    color: 'white',
    variant: 'solid'
  }
})
