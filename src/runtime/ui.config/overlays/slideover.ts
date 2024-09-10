export default {
  wrapper: 'fixed inset-0 flex z-50',
  overlay: {
    base: 'fixed inset-0 transition-opacity',
    background: 'bg-gray-200/75 dark:bg-gray-800/75',
    // Syntax for `<TransitionRoot>` component https://headlessui.com/v1/vue/transition#basic-example
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
  height: 'h-screen max-h-96',
  translate: {
    base: 'translate-x-0',
    left: '-translate-x-full rtl:translate-x-full',
    right: 'translate-x-full rtl:-translate-x-full',
    top: '-translate-y-full',
    bottom: 'translate-y-full'
  },
  // Syntax for `<TransitionRoot>` component https://headlessui.com/v1/vue/transition#basic-example
  transition: {
    enter: 'transform transition ease-in-out duration-300',
    leave: 'transform transition ease-in-out duration-200'
  }
}
