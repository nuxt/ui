import { arrow } from '../popper'

export default {
  wrapper: 'relative',
  container: 'z-50 group',
  trigger: 'inline-flex w-full',
  width: '',
  background: 'bg-white dark:bg-gray-900',
  shadow: 'shadow-lg',
  rounded: 'rounded-md',
  ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
  base: 'overflow-hidden focus:outline-none relative',
  // Syntax for `<Transition>` component https://vuejs.org/guide/built-ins/transition.html#css-based-transitions
  transition: {
    enterActiveClass: 'transition ease-out duration-200',
    enterFromClass: 'opacity-0 translate-y-1',
    enterToClass: 'opacity-100 translate-y-0',
    leaveActiveClass: 'transition ease-in duration-150',
    leaveFromClass: 'opacity-100 translate-y-0',
    leaveToClass: 'opacity-0 translate-y-1'
  },
  overlay: {
    base: 'fixed inset-0 transition-opacity z-50',
    background: 'bg-gray-200/75 dark:bg-gray-800/75',
    transition: {
      enterActiveClass: 'ease-out duration-200',
      enterFromClass: 'opacity-0',
      enterToClass: 'opacity-100',
      leaveActiveClass: 'ease-in duration-150',
      leaveFromClass: 'opacity-100',
      leaveToClass: 'opacity-0'
    }
  },
  popper: {
    strategy: 'fixed'
  },
  default: {
    openDelay: 0,
    closeDelay: 0
  },
  arrow
}
