export default {
  wrapper: 'relative z-50',
  inner: 'fixed inset-0 overflow-y-auto',
  container: 'flex min-h-full items-end sm:items-center justify-center text-center',
  padding: 'p-4 sm:p-0',
  margin: 'sm:my-8',
  base: 'relative text-left rtl:text-right flex flex-col',
  overlay: {
    base: 'fixed inset-0 transition-opacity',
    background: 'bg-gray-200/75 dark:bg-gray-800/75',
    // Syntax for `<TransitionRoot>` component https://headlessui.com/v1/vue/transition#basic-example
    transition: {
      enter: 'ease-out duration-300',
      enterFrom: 'opacity-0',
      enterTo: 'opacity-100',
      leave: 'ease-in duration-200',
      leaveFrom: 'opacity-100',
      leaveTo: 'opacity-0'
    }
  },
  background: 'bg-white dark:bg-gray-900',
  ring: '',
  rounded: 'rounded-lg',
  shadow: 'shadow-xl',
  width: 'w-full sm:max-w-lg',
  height: '',
  fullscreen: 'w-screen h-screen',
  // Syntax for `<TransitionRoot>` component https://headlessui.com/v1/vue/transition#basic-example
  transition: {
    enter: 'ease-out duration-300',
    enterFrom: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
    enterTo: 'opacity-100 translate-y-0 sm:scale-100',
    leave: 'ease-in duration-200',
    leaveFrom: 'opacity-100 translate-y-0 sm:scale-100',
    leaveTo: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
  }
}
