const input = {
  wrapper: 'relative',
  base: 'block w-full u-bg-white u-text-gray-700 disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none',
  size: {
    xxs: 'text-xs',
    xs: 'text-xs',
    sm: 'text-sm leading-4',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-base'
  },
  spacing: {
    xxs: 'px-1 py-0.5',
    xs: 'px-2.5 py-1.5',
    sm: 'px-3 py-2',
    md: 'px-4 py-2',
    lg: 'px-4 py-2',
    xl: 'px-6 py-3'
  },
  leading: {
    spacing: {
      xxs: 'pl-7',
      xs: 'pl-7',
      sm: 'pl-10',
      md: 'pl-10',
      lg: 'pl-10',
      xl: 'pl-10'
    }
  },
  trailing: {
    spacing: {
      xxs: 'pr-7',
      xs: 'pr-7',
      sm: 'pr-10',
      md: 'pr-10',
      lg: 'pr-10',
      xl: 'pr-10'
    }
  },
  appearance: {
    default: 'focus:ring-1 focus:ring-primary-500 focus:border-primary-500 border u-border-gray-300 rounded-md shadow-sm',
    none: 'border-0 bg-transparent focus:ring-0 focus:shadow-none'
  },
  icon: {
    base: 'u-text-gray-400',
    size: {
      xxs: 'h-3 w-3',
      xs: 'h-4 w-4',
      sm: 'h-5 w-5',
      md: 'h-5 w-5',
      lg: 'h-5 w-5',
      xl: 'h-5 w-5'
    },
    leading: {
      wrapper: 'absolute inset-y-0 left-0 flex items-center pointer-events-none',
      spacing: {
        xxs: 'ml-2',
        xs: 'ml-2',
        sm: 'ml-3',
        md: 'ml-3',
        lg: 'ml-3',
        xl: 'ml-3'
      }
    },
    trailing: {
      wrapper: 'absolute inset-y-0 right-0 flex items-center pointer-events-none',
      spacing: {
        xxs: 'mr-2',
        xs: 'mr-2',
        sm: 'mr-3',
        md: 'mr-3',
        lg: 'mr-3',
        xl: 'mr-3'
      }
    }
  }
}

const textarea = {
  ...input
}

const select = {
  ...input
}

const button = {
  base: ''
}

export default {
  input,
  textarea,
  select,
  button
}
