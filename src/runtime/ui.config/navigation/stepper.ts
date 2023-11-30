export default {
  wrapper: 'flex items-center justify-center w-full text-center',
  base: 'flex md:w-full items-center justify-center',
  step: {
    base: 'flex gap-2 items-center',
    active: 'text-gray-900 dark:text-white',
    inactive: 'text-gray-500 dark:text-gray-400',
    padding: 'px-3',
    size: 'text-sm',
    font: 'font-medium',
    divider: 'w-full h-px bg-gray-200 dark:bg-gray-800',
    leading: {
      wrapper: 'font-xl w-5 flex justify-center items-center',
      icon: 'w-5 h-5',
      size: 'xs'
    }
  }
}
