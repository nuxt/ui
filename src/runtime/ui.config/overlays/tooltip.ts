import { arrow } from '../popper'

export default {
  wrapper: 'relative inline-flex',
  container: 'z-20 group',
  width: 'max-w-xs',
  background: 'bg-white dark:bg-gray-900',
  color: 'text-gray-900 dark:text-white',
  shadow: 'shadow',
  rounded: 'rounded',
  ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
  base: '[@media(pointer:coarse)]:hidden h-6 px-2 py-1 text-xs font-normal truncate relative',
  shortcuts: 'hidden md:inline-flex flex-shrink-0 gap-0.5',
  middot: 'mx-1 text-gray-700 dark:text-gray-200',
  // Syntax for `<Transition>` component https://vuejs.org/guide/built-ins/transition.html#css-based-transitions
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
  },
  default: {
    openDelay: 0,
    closeDelay: 0
  },
  arrow: {
    ...arrow,
    base: '[@media(pointer:coarse)]:hidden invisible before:visible before:block before:rotate-45 before:z-[-1] before:w-2 before:h-2'
  }
}
