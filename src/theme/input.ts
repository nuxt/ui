import type { ModuleOptions } from '../module'
import { buttonGroupVariantWithRoot } from './button-group'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative inline-flex items-center',
    base: 'w-full rounded-md border-0 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75',
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
      outline: '',
      none: 'bg-transparent'
    },
    color: {
      ...Object.fromEntries(options.colors.map((color: string) => [color, ''])),
      white: '',
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
    type: {
      file: 'file:mr-1.5 file:font-medium file:text-gray-500 dark:file:text-gray-400 file:outline-none'
    }
  },
  compoundVariants: [...options.colors.map((color: string) => ({
    color,
    variant: 'outline',
    class: `shadow-sm bg-transparent text-gray-900 dark:text-white ring ring-inset ring-${color}-500 dark:ring-${color}-400 focus-visible:ring-2 focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400`
  })), {
    color: 'white',
    variant: 'outline',
    class: 'shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring ring-inset ring-gray-300 dark:ring-gray-700 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400'
  }, {
    color: 'gray',
    variant: 'outline',
    class: 'shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ring ring-inset ring-gray-300 dark:ring-gray-700 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400'
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
    color: 'white',
    variant: 'outline'
  }
})
