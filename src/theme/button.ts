import type { ModuleOptions } from '../module'
import { buttonGroupVariant } from './button-group'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    base: ['rounded-md font-medium inline-flex items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75', options.transitions && 'transition-colors'],
    label: 'truncate',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    trailingIcon: 'shrink-0'
  },
  variants: {
    ...buttonGroupVariant,
    color: {
      ...Object.fromEntries(options.colors.map((color: string) => [color, ''])),
      gray: ''
    },
    variant: {
      solid: '',
      outline: '',
      soft: '',
      subtle: '',
      ghost: '',
      link: ''
    },
    size: {
      xs: {
        base: 'px-2 py-1 text-xs gap-1',
        leadingIcon: 'size-4',
        trailingIcon: 'size-4'
      },
      sm: {
        base: 'px-2.5 py-1.5 text-xs gap-1.5',
        leadingIcon: 'size-4',
        trailingIcon: 'size-4'
      },
      md: {
        base: 'px-2.5 py-1.5 text-sm gap-1.5',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5'
      },
      lg: {
        base: 'px-3 py-2 text-sm gap-2',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5'
      },
      xl: {
        base: 'px-3 py-2 text-base gap-2',
        leadingIcon: 'size-6',
        trailingIcon: 'size-6'
      }
    },
    block: {
      true: {
        base: 'w-full',
        trailingIcon: 'ms-auto'
      }
    },
    square: {
      true: ''
    },
    leading: {
      true: ''
    },
    trailing: {
      true: ''
    },
    loading: {
      true: ''
    }
  },
  compoundVariants: [...options.colors.map((color: string) => ({
    color,
    variant: 'solid',
    class: `text-white dark:text-gray-900 bg-${color}-500 hover:bg-${color}-600 disabled:bg-${color}-500 dark:bg-${color}-400 dark:hover:bg-${color}-500 dark:disabled:bg-${color}-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${color}-500 dark:focus-visible:outline-${color}-400`
  })), ...options.colors.map((color: string) => ({
    color,
    variant: 'outline',
    class: `ring ring-inset ring-${color}-500/50 dark:ring-${color}-400/50 text-${color}-500 dark:text-${color}-400 hover:bg-${color}-500/10 disabled:bg-transparent dark:hover:bg-${color}-400/10 dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400`
  })), ...options.colors.map((color: string) => ({
    color,
    variant: 'soft',
    class: `text-${color}-500 dark:text-${color}-400 bg-${color}-500/10 hover:bg-${color}-500/15 focus-visible:bg-${color}-500/15 disabled:bg-${color}-500/10 dark:bg-${color}-400/10 dark:hover:bg-${color}-400/15 dark:focus-visible:bg-${color}-400/15 dark:disabled:bg-${color}-400/10`
  })), ...options.colors.map((color: string) => ({
    color,
    variant: 'subtle',
    class: `text-${color}-500 dark:text-${color}-400 ring ring-inset ring-${color}-500/25 dark:ring-${color}-400/25 bg-${color}-500/10 hover:bg-${color}-500/15 disabled:bg-${color}-500/10 dark:bg-${color}-400/10 dark:hover:bg-${color}-400/15 dark:disabled:bg-${color}-400/10 focus-visible:ring-2 focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400`
  })), ...options.colors.map((color: string) => ({
    color,
    variant: 'ghost',
    class: `text-${color}-500 dark:text-${color}-400 hover:bg-${color}-500/10 focus-visible:bg-${color}-500/10 disabled:bg-transparent dark:hover:bg-${color}-400/10 dark:focus-visible:bg-${color}-400/10 dark:disabled:bg-transparent`
  })), ...options.colors.map((color: string) => ({
    color,
    variant: 'link',
    class: `text-${color}-500 hover:text-${color}-600 disabled:text-${color}-500 dark:text-${color}-400 dark:hover:text-${color}-500 dark:disabled:text-${color}-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400`
  })), {
    color: 'gray',
    variant: 'solid',
    class: 'text-white dark:text-gray-900 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-900 dark:bg-white dark:hover:bg-gray-200 dark:disabled:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:focus-visible:outline-white'
  }, {
    color: 'gray',
    variant: 'outline',
    class: 'ring ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-white hover:bg-gray-100 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white'
  }, {
    color: 'gray',
    variant: 'soft',
    class: 'text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 focus-visible:bg-gray-200 disabled:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:focus-visible:bg-gray-700/50 dark:disabled:bg-gray-800'
  }, {
    color: 'gray',
    variant: 'subtle',
    class: 'ring ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:disabled:bg-gray-800 focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white'
  }, {
    color: 'gray',
    variant: 'ghost',
    class: 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 focus-visible:bg-gray-100 disabled:bg-transparent dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800 dark:hover:disabled:bg-transparent'
  }, {
    color: 'gray',
    variant: 'link',
    class: 'text-gray-500 hover:text-gray-700 disabled:text-gray-500 dark:text-gray-400 dark:hover:text-gray-200 dark:disabled:text-gray-400 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white'
  }, {
    size: 'xs',
    square: true,
    class: 'p-1'
  }, {
    size: 'sm',
    square: true,
    class: 'p-1.5'
  }, {
    size: 'md',
    square: true,
    class: 'p-1.5'
  }, {
    size: 'lg',
    square: true,
    class: 'p-2'
  }, {
    size: 'xl',
    square: true,
    class: 'p-2'
  }, {
    loading: true,
    leading: true,
    class: {
      leadingIcon: 'animate-spin'
    }
  }, {
    loading: true,
    leading: false,
    trailing: true,
    class: {
      trailingIcon: 'animate-spin'
    }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
})
