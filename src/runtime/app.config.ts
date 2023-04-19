// Elements

const avatar = {
  wrapper: 'relative inline-flex items-center justify-center',
  background: 'bg-gray-100 dark:bg-gray-800',
  rounded: 'rounded-full',
  placeholder: 'text-xs font-medium leading-none text-gray-900 dark:text-white truncate',
  size: {
    '3xs': 'h-4 w-4 text-xs',
    '2xs': 'h-5 w-5 text-xs',
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-md',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-14 w-14 text-xl',
    '2xl': 'h-16 w-16 text-2xl',
    '3xl': 'h-20 w-20 text-3xl'
  },
  chip: {
    base: 'absolute block rounded-full ring-2 ring-white dark:ring-gray-900',
    position: {
      'top-right': 'top-0 right-0',
      'bottom-right': 'bottom-0 right-0',
      'top-left': 'top-0 left-0',
      'bottom-left': 'bottom-0 left-0'
    },
    variant: {
      solid: 'bg-{color}-400'
    },
    size: {
      '3xs': 'h-1 w-1',
      '2xs': 'h-1 w-1',
      xs: 'h-1.5 w-1.5',
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-3.5 w-3.5',
      '2xl': 'h-3.5 w-3.5',
      '3xl': 'h-4 w-4'
    }
  },
  default: {
    size: 'md',
    chipVariant: 'solid',
    chipPosition: 'top-right'
  }
}

const avatarGroup = {
  wrapper: 'flex flex-row-reverse',
  ring: 'ring-2 ring-white dark:ring-gray-900',
  margin: '-mr-1.5 first:mr-0'
}

const badge = {
  base: 'inline-flex items-center font-medium',
  rounded: 'rounded-md',
  size: {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-sm px-3 py-0.5',
    xl: 'text-sm px-4 py-1'
  },
  variant: {
    solid: 'bg-{color}-100 dark:bg-{color}-700 text-{color}-800 dark:text-{color}-100'
  },
  default: {
    size: 'md',
    variant: 'solid',
    color: 'primary'
  }
}

// TODO: improve sizes, should have `2xs`
const button = {
  base: 'font-medium disabled:pointer-events-none disabled:select-none disabled:opacity-75',
  rounded: 'rounded-md',
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
  compact: {
    xxs: 'p-1 sm:px-2',
    xs: 'p-1.5 sm:px-2.5',
    sm: 'p-2 sm:px-3',
    md: 'p-2 sm:px-4',
    lg: 'p-2 sm:px-4',
    xl: 'p-3 sm:px-6'
  },
  color: {
    white: {
      solid: 'shadow-sm dark:shadow-white/5 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/50',
      ghost: 'text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900'
    },
    gray: {
      solid: 'shadow-sm dark:shadow-white/5 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/50',
      // TODO: For Volta
      // 'outline-ghost': 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:ring-1 ring-inset ring-gray-300 dark:ring-gray-700',
      ghost: 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800',
      link: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline-offset-4 hover:underline'
    },
    black: {
      solid: 'shadow-sm dark:shadow-white/5 text-white dark:text-gray-900 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100',
      link: 'text-gray-900 dark:text-white underline-offset-4 hover:underline'
    }
  },
  variant: {
    solid: 'shadow-sm dark:shadow-white/5 text-white bg-{color}-500 hover:bg-{color}-600 dark:hover:bg-{color}-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400',
    outline: 'ring-1 ring-inset ring-current text-{color}-500 dark:text-{color}-400 hover:bg-{color}-50 dark:hover:bg-{color}-950 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400',
    soft: 'text-{color}-500 dark:text-{color}-400 bg-{color}-50 hover:bg-{color}-100 dark:bg-{color}-950 dark:hover:bg-{color}-900 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400',
    ghost: 'text-{color}-500 dark:text-{color}-400 hover:bg-{color}-50 dark:hover:bg-{color}-950 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400',
    link: 'text-{color}-500 hover:text-{color}-600 dark:text-{color}-400 dark:hover:text-{color}-500 underline-offset-4 hover:underline focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400'
  },
  icon: {
    base: 'flex-shrink-0',
    loading: 'i-heroicons-arrow-path-20-solid',
    size: {
      xxs: 'h-3.5 w-3.5',
      xs: 'h-4 w-4',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-5 w-5',
      xl: 'h-5 w-5'
    },
    leading: {
      base: '',
      spacing: {
        xxs: '-ml-0.5 mr-1',
        xs: '-ml-0.5 mr-1.5',
        sm: '-ml-0.5 mr-2',
        md: '-ml-1 mr-2',
        lg: '-ml-1 mr-3',
        xl: '-ml-1 mr-3'
      },
      compactSpacing: {
        xxs: 'sm:-ml-0.5 sm:mr-1',
        xs: 'sm:-ml-0.5 sm:mr-1.5',
        sm: 'sm:-ml-0.5 sm:mr-2',
        md: 'sm:-ml-1 sm:mr-2',
        lg: 'sm:-ml-1 sm:mr-3',
        xl: 'sm:-ml-1 sm:mr-3'
      }
    },
    trailing: {
      base: '',
      spacing: {
        xxs: 'ml-1 -mr-0.5',
        xs: 'ml-1.5 -mr-0.5',
        sm: 'ml-2 -mr-0.5',
        md: 'ml-2 -mr-1',
        lg: 'ml-3 -mr-1',
        xl: 'ml-3 -mr-1'
      },
      compactSpacing: {
        xxs: 'sm:ml-1 sm:-mr-0.5',
        xs: 'sm:ml-1.5 sm:-mr-0.5',
        sm: 'sm:ml-2 sm:-mr-0.5',
        md: 'sm:ml-2 sm:-mr-1',
        lg: 'sm:ml-3 sm:-mr-1',
        xl: 'sm:ml-3 sm:-mr-1'
      }
    }
  },
  default: {
    size: 'md',
    variant: 'solid',
    color: 'primary'
  }
}

const buttonGroup = {
  wrapper: 'inline-flex',
  rounded: 'rounded-md',
  shadow: 'shadow-sm dark:shadow-white/5'
}

const dropdown = {
  wrapper: 'relative inline-flex text-left',
  container: 'z-20',
  width: 'w-48',
  background: 'bg-white dark:bg-gray-800',
  shadow: 'shadow-lg dark:shadow-white/10',
  rounded: 'rounded-md',
  ring: 'ring-1 ring-gray-200 dark:ring-gray-700',
  base: 'focus:outline-none',
  divide: 'divide-y divide-gray-200 dark:divide-gray-700',
  spacing: 'p-1',
  item: {
    base: 'group flex items-center gap-2 px-2 py-1.5 text-sm w-full rounded-md',
    active: 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white',
    inactive: 'text-gray-700 dark:text-gray-200',
    disabled: 'cursor-not-allowed opacity-50',
    icon: 'h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 flex-shrink-0',
    avatar: '-m-0.5 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 flex-shrink-0',
    shortcuts: 'hidden md:inline-flex flex-shrink-0 text-xs font-semibold text-gray-500 dark:text-gray-400 ml-auto'
  },
  transition: {
    leaveActiveClass: 'transition ease-in duration-100',
    leaveFromClass: 'opacity-100',
    leaveToClass: 'opacity-0'
  },
  popper: {
    placement: 'bottom-end',
    strategy: 'fixed'
  }
}

// Forms

const formGroup = {
  wrapper: '',
  label: 'block text-sm font-medium text-gray-700 dark:text-gray-200',
  labelWrapper: 'flex content-center justify-between',
  container: 'mt-1 relative',
  required: 'text-red-400',
  description: 'text-sm leading-5 text-gray-500 dark:text-gray-400',
  hint: 'text-sm leading-5 text-gray-500 dark:text-gray-400',
  help: 'mt-2 text-sm text-gray-500 dark:text-gray-400'
}

// TODO: improve sizes
const input = {
  wrapper: 'relative',
  base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none',
  custom: '',
  size: {
    // xxs: 'text-xs',
    // xs: 'text-xs',
    // sm: 'text-sm leading-4',
    md: 'sm:text-sm sm:leading-6'
    // lg: 'text-base',
    // xl: 'text-base'
  },
  spacing: {
    // xxs: 'px-1 py-0.5',
    // xs: 'px-2.5 py-1.5',
    // sm: 'px-3 py-2',
    md: 'px-3 py-1.5'
    // lg: 'px-4 py-2',
    // xl: 'px-6 py-3'
  },
  leading: {
    spacing: {
      // xxs: 'pl-7',
      // xs: 'pl-7',
      // sm: 'pl-10',
      md: 'pl-10'
      // lg: 'pl-10',
      // xl: 'pl-10'
    }
  },
  trailing: {
    spacing: {
      // xxs: 'pr-7',
      // xs: 'pr-7',
      // sm: 'pr-10',
      md: 'pr-10'
      // lg: 'pr-10',
      // xl: 'pr-10'
    }
  },
  appearance: {
    white: 'border-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md shadow-sm dark:shadow-white/5 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400 placeholder:text-gray-400 dark:placeholder:text-gray-500',
    gray: 'border-0 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md shadow-sm dark:shadow-white/5 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400',
    none: 'border-0 bg-transparent focus:ring-0 focus:shadow-none'
  },
  icon: {
    base: 'text-gray-400 dark:text-gray-500',
    size: {
      // xxs: 'h-3 w-3',
      // xs: 'h-4 w-4',
      // sm: 'h-5 w-5',
      md: 'h-5 w-5'
      // lg: 'h-5 w-5',
      // xl: 'h-5 w-5'
    },
    leading: {
      wrapper: 'absolute inset-y-0 left-0 flex items-center pointer-events-none',
      spacing: {
        // xxs: 'ml-2',
        // xs: 'ml-2',
        // sm: 'ml-2',
        md: 'pl-3'
        // lg: 'ml-3',
        // xl: 'ml-3'
      }
    },
    trailing: {
      wrapper: 'absolute inset-y-0 right-0 flex items-center pointer-events-none',
      spacing: {
        // xxs: 'mr-2',
        // xs: 'mr-2',
        // sm: 'mr-2',
        md: 'pr-3'
        // lg: 'mr-3',
        // xl: 'mr-3'
      }
    }
  },
  default: {
    size: 'md',
    appearance: 'white'
  }
}

const textarea = {
  ...input
}

const select = {
  ...input
}

const selectMenu = {
  wrapper: 'relative',
  container: 'z-20',
  width: 'w-full',
  height: 'max-h-60',
  base: 'relative focus:outline-none overflow-y-auto',
  background: 'bg-white dark:bg-gray-800',
  shadow: 'shadow-lg dark:shadow-white/5',
  rounded: 'rounded-md',
  spacing: 'p-1',
  ring: 'ring-1 ring-gray-200 dark:ring-gray-700',
  input: 'block w-[calc(100%+0.5rem)] focus:ring-transparent text-sm px-3 py-1.5 u-text-gray-700 bg-white dark:bg-gray-800 border-0 border-b border-gray-200 dark:border-gray-700 focus:border-inherit sticky -top-1 -mt-1 mb-1 -mx-1 z-10',
  option: {
    base: 'cursor-default select-none relative py-1.5 rounded-md text-sm text-gray-900 dark:text-white',
    container: 'flex items-center gap-2',
    active: 'bg-gray-100 dark:bg-gray-900',
    inactive: '',
    selected: 'font-semibold pl-2 pr-8',
    unselected: 'font-normal px-2',
    disabled: 'cursor-not-allowed opacity-50',
    empty: 'text-sm text-gray-400 dark:text-gray-500 px-2 py-1.5',
    icon: {
      name: 'i-heroicons-check-20-solid',
      base: 'absolute inset-y-0 right-0 flex items-center pr-2',
      active: '',
      inactive: '',
      size: 'h-4 w-4'
    }
  },
  transition: {
    leaveActiveClass: 'transition ease-in duration-100',
    leaveFromClass: 'opacity-100',
    leaveToClass: 'opacity-0'
  },
  popper: {
    placement: 'bottom-end'
  }
}

const radio = {
  wrapper: 'relative flex items-start',
  base: 'h-4 w-4 text-primary-500 dark:text-primary-400 focus:ring-2 focus:ring-offset-2 bg-white dark:bg-gray-900 dark:checked:bg-current dark:checked:border-transparent focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-white dark:focus:ring-offset-gray-900 border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed',
  label: 'font-medium text-gray-700 dark:text-gray-200',
  required: 'text-red-400',
  help: 'text-gray-500 dark:text-gray-400'
}

const checkbox = {
  ...radio,
  base: radio.base + ' rounded'
}

const toggle = {
  base: 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-white dark:focus:ring-offset-gray-900',
  active: 'bg-primary-500 dark:bg-primary-400',
  inactive: 'bg-gray-200 dark:bg-gray-700',
  container: {
    base: 'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow dark:shadow-white/10 transform ring-0 transition ease-in-out duration-200',
    active: 'translate-x-5',
    inactive: 'translate-x-0'
  },
  icon: {
    base: 'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity',
    active: 'opacity-100 ease-in duration-200',
    inactive: 'opacity-0 ease-out duration-100',
    on: 'h-3 w-3 text-primary-500 dark:text-primary-400',
    off: 'h-3 w-3 text-gray-400 dark:text-gray-500'
  }
}

// Layout

const card = {
  base: 'overflow-hidden',
  background: 'bg-white dark:bg-gray-800',
  divide: 'divide-y divide-gray-200 dark:divide-gray-700',
  ring: 'ring-1 ring-gray-200 dark:ring-gray-700',
  rounded: 'rounded-lg',
  shadow: '',
  body: {
    background: '',
    spacing: 'px-4 py-5 sm:p-6'
  },
  header: {
    background: '',
    spacing: 'px-4 py-5 sm:px-6'
  },
  footer: {
    background: '',
    spacing: 'px-4 py-4 sm:px-6'
  }
}

const container = {
  base: 'mx-auto',
  spacing: 'px-4 sm:px-6 lg:px-8',
  constrained: 'max-w-7xl'
}

// Navigation

const verticalNavigation = {
  wrapper: '',
  base: 'group flex items-center gap-2 text-sm font-medium rounded-md w-full relative focus:outline-none after:absolute after:inset-px after:z-[-1] after:rounded-md disabled:cursor-not-allowed disabled:opacity-75',
  spacing: 'px-3 py-1.5',
  active: 'u-text-gray-900 after:bg-gray-100 dark:after:bg-gray-800',
  inactive: 'u-text-gray-500 hover:u-text-gray-900 hover:after:bg-gray-50 dark:hover:after:bg-gray-800/50 focus-visible:after:bg-gray-50 dark:focus-visible:after:bg-gray-800/50',
  icon: {
    base: 'flex-shrink-0 w-4 h-4',
    spacing: '-ml-0.5',
    active: 'u-text-gray-700',
    inactive: 'u-text-gray-400 group-hover:u-text-gray-700'
  },
  avatar: {
    base: 'flex-shrink-0',
    spacing: '-ml-0.5'
  },
  badge: {
    base: 'ml-auto inline-block py-0.5 px-2 text-xs rounded-md -mr-1 -my-0.5',
    active: 'bg-white dark:bg-gray-900',
    inactive: 'u-bg-gray-100 u-text-gray-600 group-hover:bg-white dark:group-hover:bg-gray-900'
  }
}

const commandPalette = {
  wrapper: 'flex flex-col flex-1 min-h-0 divide-y divide-gray-100 dark:divide-gray-800',
  input: {
    base: 'w-full h-12 pr-4 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 pl-[3.25rem] text-gray-900 dark:text-white focus:ring-0 sm:text-sm',
    icon: {
      base: 'pointer-events-none absolute top-3.5 left-5 h-5 w-5 text-gray-400 dark:text-gray-500',
      name: 'i-heroicons-magnifying-glass-20-solid'
    },
    close: {
      base: 'absolute right-2',
      variant: 'transparent',
      size: 'md',
      icon: {
        name: ''
      }
    }
  },
  empty: {
    icon: {
      name: 'i-heroicons-magnifying-glass-20-solid'
    }
  },
  option: {
    selected: {
      icon: {
        name: 'i-heroicons-check-20-solid'
      }
    },
    shortcuts: 'hidden md:inline-flex flex-shrink-0 text-xs font-semibold text-gray-500 dark:text-gray-400'
  }
}

// Overlays

const modal = {
  wrapper: 'relative z-50',
  inner: 'fixed inset-0 overflow-y-auto',
  container: 'flex min-h-full items-end sm:items-center justify-center p-4 sm:p-0 text-center',
  base: 'relative inline-block align-bottom text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle w-full',
  background: 'bg-white dark:bg-gray-900',
  overlay: {
    background: 'bg-gray-500/75 dark:bg-gray-600/75',
    transition: {
      enter: 'ease-out duration-300',
      enterFrom: 'opacity-0',
      enterTo: 'opacity-100',
      leave: 'ease-in duration-200',
      leaveFrom: 'opacity-100',
      leaveTo: 'opacity-0'
    }
  },
  border: '',
  ring: '',
  rounded: 'rounded-lg',
  shadow: 'shadow-xl dark:shadow-white/10',
  width: 'sm:max-w-lg',
  transition: {
    enter: 'ease-out duration-300',
    enterFrom: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
    enterTo: 'opacity-100 translate-y-0 sm:scale-100',
    leave: 'ease-in duration-200',
    leaveFrom: 'opacity-100 translate-y-0 sm:scale-100',
    leaveTo: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
  }
}

const slideover = {
  wrapper: 'fixed inset-0 flex z-40',
  overlay: {
    background: 'bg-gray-500/75 dark:bg-gray-600/75',
    transition: {
      enter: 'ease-in-out duration-500',
      enterFrom: 'opacity-0',
      enterTo: 'opacity-100',
      leave: 'ease-in-out duration-500',
      leaveFrom: 'opacity-100',
      leaveTo: 'opacity-0'
    }
  },
  base: 'relative flex-1 flex flex-col w-full focus:outline-none',
  background: 'bg-white dark:bg-gray-900',
  width: 'max-w-md',
  header: 'flex items-center justify-between flex-shrink-0 px-4 sm:px-6 h-16 border-b border-gray-200 dark:border-gray-800',
  transition: {
    enter: 'transform transition ease-in-out duration-500 sm:duration-700',
    leave: 'transform transition ease-in-out duration-500 sm:duration-700'
  }
}

const tooltip = {
  wrapper: 'relative inline-flex',
  container: 'z-20',
  width: 'max-w-xs',
  background: 'bg-white dark:bg-gray-900',
  shadow: 'shadow dark:shadow-white/10',
  rounded: 'rounded',
  ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
  base: 'invisible lg:visible h-6 px-2 py-1 text-xs font-normal truncate',
  shortcuts: 'hidden md:inline-flex items-center justify-end flex-shrink-0 gap-0.5 ml-1',
  transition: {
    enterActiveClass: 'transition ease-out duration-200',
    enterFromClass: 'opacity-0 translate-y-1',
    enterToClass: 'opacity-100 translate-y-0',
    leaveActiveClass: 'transition ease-in duration-150',
    leaveFromClass: 'opacity-100 translate-y-0',
    leaveToClass: 'opacity-0 translate-y-1'
  },
  popper: {
    strategy: 'fixed'
  }
}

const popover = {
  wrapper: 'relative',
  container: 'z-20',
  width: '',
  background: 'bg-white dark:bg-gray-900',
  shadow: 'shadow-lg dark:shadow-white/10',
  rounded: 'rounded-md',
  ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
  base: 'overflow-hidden focus:outline-none',
  transition: {
    enterActiveClass: 'transition ease-out duration-200',
    enterFromClass: 'opacity-0 translate-y-1',
    enterToClass: 'opacity-100 translate-y-0',
    leaveActiveClass: 'transition ease-in duration-150',
    leaveFromClass: 'opacity-100 translate-y-0',
    leaveToClass: 'opacity-0 translate-y-1'
  },
  popper: {
    strategy: 'fixed'
  }
}

const contextMenu = {
  wrapper: 'relative',
  container: 'z-20',
  width: '',
  background: 'bg-white dark:bg-gray-900',
  shadow: 'shadow-lg dark:shadow-white/10',
  rounded: 'rounded-md',
  ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
  base: 'overflow-hidden focus:outline-none',
  transition: {
    enterActiveClass: 'transition ease-out duration-200',
    enterFromClass: 'opacity-0 translate-y-1',
    enterToClass: 'opacity-100 translate-y-0',
    leaveActiveClass: 'transition ease-in duration-150',
    leaveFromClass: 'opacity-100 translate-y-0',
    leaveToClass: 'opacity-0 translate-y-1'
  },
  popper: {
    placement: 'bottom-start',
    scroll: false
  }
}

const notification = {
  background: 'bg-white dark:bg-gray-900',
  shadow: 'shadow-lg dark:shadow-white/10',
  rounded: 'rounded-lg',
  ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
  type: {
    info: 'i-heroicons-information-circle',
    success: 'i-heroicons-check-circle',
    warning: 'i-heroicons-exclamation-circle',
    error: 'i-heroicons-x-circle'
  },
  icon: {
    base: 'w-6 h-6',
    color: {
      warning: 'text-orange-400',
      info: 'text-blue-400',
      success: 'text-green-400',
      error: 'text-red-400'
    }
  },
  close: {
    icon: {
      name: 'i-heroicons-x-mark-20-solid'
    }
  },
  transition: {
    enterActiveClass: 'transform ease-out duration-300 transition',
    enterFromClass: 'translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2',
    enterToClass: 'translate-y-0 opacity-100 sm:translate-x-0',
    leaveActiveClass: 'transition ease-in duration-100',
    leaveFromClass: 'opacity-100',
    leaveToClass: 'opacity-0'
  }
}

export default {
  ui: {
    card,
    modal,
    button,
    buttonGroup,
    badge,
    formGroup,
    input,
    textarea,
    select,
    selectMenu,
    checkbox,
    radio,
    container,
    toggle,
    verticalNavigation,
    dropdown,
    avatar,
    avatarGroup,
    slideover,
    notification,
    tooltip,
    popover,
    contextMenu,
    commandPalette
  }
}
