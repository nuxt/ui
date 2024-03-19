export default {
  slots: {
    root: 'relative',
    list: '',
    item: '',
    base: 'group relative w-full flex items-center gap-1.5 font-medium text-sm before:absolute before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2 focus-visible:before:ring-primary-500 dark:focus-visible:before:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-75',
    icon: 'shrink-0 w-5 h-5 relative',
    avatar: 'shrink-0 relative',
    label: 'truncate relative',
    badge: 'shrink-0 ms-auto relative rounded'
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'w-full flex items-center justify-between',
        list: 'flex items-center min-w-0',
        item: 'min-w-0',
        base: 'px-2.5 py-3.5 before:inset-x-0 before:inset-y-2 hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50 after:absolute after:bottom-0 after:inset-x-2.5 after:block after:h-[2px] after:mt-2 after:rounded-full'
      },
      vertical: {
        root: 'flex flex-col *:py-1.5 first:*:pt-0 last:*:pb-0 divide-y divide-gray-200 dark:divide-gray-800',
        base: 'px-2.5 py-1.5 before:inset-px'
      }
    },
    active: {
      true: {
        base: 'text-gray-900 dark:text-white',
        icon: 'text-gray-700 dark:text-gray-200'
      },
      false: {
        base: 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
        icon: 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200'
      }
    }
  },
  compoundVariants: [{
    orientation: 'horizontal',
    active: true,
    class: 'after:bg-primary-500 dark:after:bg-primary-400'
  }, {
    orientation: 'vertical',
    active: true,
    class: 'before:bg-gray-100 dark:before:bg-gray-800'
  }, {
    orientation: 'vertical',
    active: false,
    class: 'hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50'
  }]
}
