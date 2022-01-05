const colors = [
  'primary',
  'rose',
  'pink',
  'fuchsia',
  'purple',
  'violet',
  'indigo',
  'blue',
  'sky',
  'cyan',
  'teal',
  'emerald',
  'green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'red'
]

const button = {
  base: 'font-medium focus:outline-none disabled:cursor-not-allowed disabled:opacity-75',
  size: {
    xxs: 'text-xs',
    xs: 'text-xs',
    sm: 'text-sm leading-4',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-base'
  },
  spacing: {
    xxs: 'px-2 py-1',
    xs: 'px-2.5 py-1.5',
    sm: 'px-3 py-2',
    md: 'px-4 py-2',
    lg: 'px-4 py-2',
    xl: 'px-6 py-3'
  },
  square: {
    xxs: 'p-1',
    xs: 'p-1.5',
    sm: 'p-2',
    md: 'p-2',
    lg: 'p-2',
    xl: 'p-3'
  },
  variant: {
    ...colors.reduce((acc: any, color) => {
      acc[color] = `shadow-sm border border-transparent text-white bg-${color}-600 hover:bg-${color}-700 disabled:bg-${color}-600 focus:ring-2 focus:ring-${color}-200`
      return acc
    }, {}),
    primary: 'shadow-sm border border-transparent text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600 focus:ring-2 focus:ring-primary-200',
    secondary: 'border border-transparent text-primary-700 bg-primary-100 hover:bg-primary-200 disabled:bg-primary-100 focus:ring-2 focus:ring-primary-500',
    white: 'shadow-sm border u-border-gray-300 u-text-gray-700 u-bg-white hover:u-bg-gray-50 disabled:u-bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500',
    'white-hover': 'border border-transparent u-text-gray-500 hover:u-text-gray-700 focus:u-text-gray-700 bg-transparent hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-900 dark:focus:bg-gray-900 disabled:u-text-gray-500',
    gray: 'shadow-sm border u-border-gray-300 u-text-gray-500 hover:u-text-gray-700 focus:u-text-gray-700 bg-gray-50 dark:bg-gray-800 disabled:u-text-gray-500 focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500',
    'gray-hover': 'border border-transparent u-text-gray-500 hover:u-text-gray-700 focus:u-text-gray-700 bg-transparent hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800 disabled:u-text-gray-500',
    black: 'border border-transparent u-text-white u-bg-gray-800 hover:u-bg-gray-900 focus:u-bg-gray-900',
    'black-hover': 'border border-transparent u-text-gray-500 hover:u-text-gray-900 focus:u-text-gray-700 bg-transparent hover:bg-white dark:hover:bg-black focus:bg-white dark:focus:bg-black',
    transparent: 'border border-transparent u-text-gray-500 hover:u-text-gray-700 focus:u-text-gray-700 disabled:hover:u-text-gray-500',
    link: 'border border-transparent text-primary-500 hover:text-primary-700 focus:text-primary-700'
  },
  icon: {
    base: 'flex-shrink-0',
    loading: 'heroicons-outline:refresh',
    size: {
      xxs: 'h-3.5 w-3.5',
      xs: 'h-4 w-4',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-5 w-5',
      xl: 'h-5 w-5'
    },
    leading: {
      spacing: {
        xxs: '-ml-0.5 mr-1',
        xs: '-ml-0.5 mr-1.5',
        sm: '-ml-0.5 mr-2',
        md: '-ml-1 mr-2',
        lg: '-ml-1 mr-3',
        xl: '-ml-1 mr-3'
      }
    },
    trailing: {
      spacing: {
        xxs: 'ml-1 -mr-0.5',
        xs: 'ml-1.5 -mr-0.5',
        sm: 'ml-2 -mr-0.5',
        md: 'ml-2 -mr-1',
        lg: 'ml-3 -mr-1',
        xl: 'ml-3 -mr-1'
      }
    }
  }
}

const formGroup = {
  wrapper: '',
  label: 'block text-sm font-medium u-text-gray-700',
  labelWrapper: 'flex content-center justify-between',
  container: 'mt-1 relative',
  required: 'text-red-400',
  description: 'text-sm leading-5 u-text-gray-500',
  hint: 'text-sm leading-5 u-text-gray-500',
  help: 'mt-2 text-sm u-text-gray-500'
}

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
    default: 'focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500 border u-border-gray-300 rounded-md shadow-sm',
    none: 'border-0 bg-transparent focus:ring-0 focus:shadow-none'
  },
  icon: {
    base: 'u-text-gray-400',
    loading: 'heroicons-outline:refresh',
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

const radio = {
  wrapper: 'relative flex items-start',
  base: 'h-4 w-4 text-primary-600 focus:ring-1 focus:ring-primary-500 u-border-gray-300 dark:checked:border-primary-600 disabled:opacity-50 disabled:cursor-not-allowed',
  label: 'font-medium u-text-gray-700',
  required: 'text-red-400',
  help: 'u-text-gray-500'
}

const checkbox = {
  ...radio,
  base: `${radio.base} rounded`
}

const card = {
  base: 'overflow-hidden',
  background: 'u-bg-white',
  border: 'u-border-gray-200',
  ring: 'ring-1 u-ring-gray-200',
  shadow: '',
  body: 'px-4 py-5 sm:p-6',
  header: 'px-4 py-5 sm:px-6',
  footer: 'px-4 py-4 sm:px-6'
}

const container = {
  constrained: 'max-w-7xl'
}

const toggle = {
  base: 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500',
  active: 'bg-primary-600',
  inactive: 'u-bg-gray-200',
  container: {
    base: 'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
    active: 'translate-x-5',
    inactive: 'translate-x-0'
  },
  icon: {
    base: 'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity',
    active: 'opacity-100 ease-in duration-200',
    inactive: 'opacity-0 ease-out duration-100',
    on: 'h-3 w-3 text-primary-600',
    off: 'h-3 w-3 u-text-gray-400'
  }
}

const verticalNavigation = {
  base: 'flex items-center px-3 py-2 text-sm font-medium rounded-md',
  active: 'u-text-gray-900 u-bg-gray-100',
  inactive: 'u-text-gray-600 hover:u-text-gray-900 hover:u-bg-gray-50 focus:u-bg-gray-50',
  icon: {
    base: 'flex-shrink-0 -ml-1 mr-3 h-6 w-6',
    active: 'u-text-gray-500',
    inactive: 'u-text-gray-400 group-hover:u-text-gray-500'
  },
  badge: {
    base: 'ml-auto inline-block py-0.5 px-3 text-xs rounded-full',
    active: 'u-bg-white',
    inactive: 'u-bg-gray-100 group-hove:u-bg'
  }
}

export default {
  button,
  formGroup,
  input,
  textarea,
  select,
  checkbox,
  radio,
  card,
  container,
  toggle,
  verticalNavigation
}
