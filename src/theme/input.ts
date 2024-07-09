import type { ModuleOptions } from '../module'
import { buttonGroupVariantWithRoot } from './button-group'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative inline-flex items-center',
    base: ['w-full rounded-md border-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75', options.transitions && 'transition-colors'],
    leading: 'absolute inset-y-0 start-0 flex items-center',
    leadingIcon: 'shrink-0 text-gray-400 dark:text-gray-500',
    leadingAvatar: 'shrink-0',
    trailing: 'absolute inset-y-0 end-0 flex items-center',
    trailingIcon: 'shrink-0 text-gray-400 dark:text-gray-500'
  },
  variants: {
    ...buttonGroupVariantWithRoot,
    size: {
      xs: {
        base: 'px-2 py-1 text-xs gap-1',
        leading: 'pl-2',
        trailing: 'pr-2',
        leadingIcon: 'size-4',
        trailingIcon: 'size-4'
      },
      sm: {
        base: 'px-2.5 py-1.5 text-xs gap-1.5',
        leading: 'pl-2.5',
        trailing: 'pr-2.5',
        leadingIcon: 'size-4',
        trailingIcon: 'size-4'
      },
      md: {
        base: 'px-2.5 py-1.5 text-sm gap-1.5',
        leading: 'pl-2.5',
        trailing: 'pr-2.5',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5'
      },
      lg: {
        base: 'px-3 py-2 text-sm gap-2',
        leading: 'pl-3',
        trailing: 'pr-3',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5'
      },
      xl: {
        base: 'px-3 py-2 text-base gap-2',
        leading: 'pl-3',
        trailing: 'pr-3',
        leadingIcon: 'size-6',
        trailingIcon: 'size-6'
      }
    },
    variant: {
      outline: 'text-gray-900 dark:text-white bg-white dark:bg-gray-900 ring ring-inset ring-gray-300 dark:ring-gray-700',
      soft: 'text-gray-900 dark:text-white bg-gray-50 hover:bg-gray-100 focus:bg-gray-100 disabled:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-800 dark:focus:bg-gray-800 dark:disabled:bg-gray-800/50',
      subtle: 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 ring ring-inset ring-gray-300 dark:ring-gray-700',
      ghost: 'text-gray-900 dark:text-white hover:bg-gray-100 focus:bg-gray-100 disabled:bg-transparent dark:hover:bg-gray-800 dark:focus:bg-gray-800 dark:disabled:bg-transparent',
      none: 'text-gray-900 dark:text-white'
    },
    color: {
      ...Object.fromEntries(options.colors.map((color: string) => [color, ''])),
      gray: ''
    },
    leading: {
      true: ''
    },
    trailing: {
      true: ''
    },
    loading: {
      true: ''
    },
    highlight: {
      true: ''
    },
    type: {
      file: 'file:mr-1.5 file:font-medium file:text-gray-500 dark:file:text-gray-400 file:outline-none'
    }
  },
  compoundVariants: [...options.colors.map((color: string) => ({
    color,
    variant: ['outline', 'subtle'],
    class: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400`
  })), ...options.colors.map((color: string) => ({
    color,
    highlight: true,
    class: `ring ring-inset ring-${color}-500 dark:ring-${color}-400`
  })), {
    color: 'gray',
    variant: ['outline', 'subtle'],
    class: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-900 dark:focus-visible:ring-white'
  }, {
    color: 'gray',
    highlight: true,
    class: 'ring ring-inset ring-gray-900 dark:ring-white'
  }, {
    leading: true,
    size: 'xs',
    class: 'pl-7'
  }, {
    leading: true,
    size: 'sm',
    class: 'pl-8'
  }, {
    leading: true,
    size: 'md',
    class: 'pl-9'
  }, {
    leading: true,
    size: 'lg',
    class: 'pl-10'
  }, {
    leading: true,
    size: 'xl',
    class: 'pl-11'
  }, {
    trailing: true,
    size: 'xs',
    class: 'pr-7'
  }, {
    trailing: true,
    size: 'sm',
    class: 'pr-8'
  }, {
    trailing: true,
    size: 'md',
    class: 'pr-9'
  }, {
    trailing: true,
    size: 'lg',
    class: 'pr-10'
  }, {
    trailing: true,
    size: 'xl',
    class: 'pr-11'
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
    size: 'md',
    color: 'primary',
    variant: 'outline'
  }
})
