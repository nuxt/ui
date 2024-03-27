export default {
  slots: {
    content: 'min-w-48 bg-white dark:bg-gray-900 shadow-lg rounded-md ring ring-gray-200 dark:ring-gray-800 divide-y divide-gray-200 dark:divide-gray-800 will-change-[transform,opacity] data-[state=open]:animate-[dropdown-menu-open_100ms_ease-out] data-[state=closed]:animate-[dropdown-menu-closed_100ms_ease-in]',
    arrow: 'fill-gray-200 dark:fill-gray-800',
    group: 'p-1',
    base: 'group relative w-full flex items-center gap-1.5 p-1.5 text-sm before:absolute before:inset-px before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2 focus-visible:before:ring-primary-500 dark:focus-visible:before:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-75',
    icon: 'shrink-0 size-5 relative',
    avatar: 'shrink-0 relative',
    label: 'truncate relative',
    shortcuts: 'hidden lg:inline-flex items-center shrink-0 gap-0.5 ms-auto relative'
  },
  variants: {
    active: {
      true: {
        base: 'text-gray-900 dark:text-white before:bg-gray-100 dark:before:bg-gray-800',
        icon: 'text-gray-700 dark:text-gray-200'
      },
      false: {
        base: 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50',
        icon: 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200'
      }
    }
  }
}
