export default {
  wrapper: 'fixed inset-0 flex z-50',
  overlay: {
    base: 'fixed inset-0 transition-opacity',
    background: 'bg-gray-200/75 dark:bg-gray-800/75',
    // Syntax for `<TransitionRoot>` component https://headlessui.com/vue/transition#basic-example
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
  ring: '',
  rounded: '',
  padding: '',
  shadow: 'shadow-xl',
  width: 'w-screen max-w-md',
  translate: {
    base: 'translate-x-0',
    left: '-translate-x-full rtl:translate-x-full',
    right: 'translate-x-full rtl:-translate-x-full'
  },
  // Syntax for `<TransitionRoot>` component https://headlessui.com/vue/transition#basic-example
  transition: {
    enter: 'transform transition ease-in-out duration-300',
    leave: 'transform transition ease-in-out duration-200'
  },
  resize: {
    wrapper: 'absolute top-0 cursor-col-resize h-full flex z-50 w-4 justify-center flex-col group',
    base: 'flex h-8 w-4 flex-col items-center justify-center opacity-30 dark:opacity-40 group-hover:dark:opacity-80 group-hover:opacity-80',
    shield: 'w-full h-full absolute z-50 opacity-0 bg-transparent cursor-col-resize',
    width: {
      class: 'w-screen max-w-[var(--width)]',
      init: {
        xs: 320,
        sm: 384,
        md: 448,
        lg: 512,
        xl: 576,
        '2xl': 672
      }
    },
    icon: {
      base: 'flex-shrink-0',
      defaultIconBase: 'h-12 w-1 rounded-full transform rotate-0 group-hover:transform bg-gray-500 dark:bg-gray-400',
      defaultIconRotatePos: 'group-hover:rotate-[15deg]',
      defaultIconRotateNeg: 'group-hover:rotate-[-15deg]',
      size: {
        '2xs': 'h-4 w-4',
        xs: 'h-4 w-4',
        sm: 'h-5 w-5',
        md: 'h-5 w-5',
        lg: 'h-5 w-5',
        xl: 'h-6 w-6'
      }
    }
  },
  default: {
    resize: {
      width: 'md',
      size: 'xs'
    }
  }
}
