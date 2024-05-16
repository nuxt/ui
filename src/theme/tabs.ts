export default {
  slots: {
    root: 'flex items-center gap-2',
    list: 'relative flex rounded-lg bg-gray-50 dark:bg-gray-800 p-1 group',
    indicator: 'absolute transition-[translate,width] duration-200 bg-white dark:bg-gray-900 rounded-md shadow-sm',
    trigger: 'relative inline-flex items-center justify-center gap-1.5 shrink-0 flex-1 text-gray-500 data-[state=active]:text-gray-900 dark:text-gray-400 dark:data-[state=active]:text-white px-3 py-1.5 text-sm font-medium rounded-md disabled:cursor-not-allowed disabled:opacity-75 transition-colors ease-out focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 focus:outline-none',
    content: 'focus:outline-none',
    leadingIcon: 'shrink-0 size-5',
    leadingAvatar: 'shrink-0',
    label: 'truncate'
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'flex-col',
        list: 'w-full',
        indicator: 'left-0 inset-y-1 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position]'
      },
      vertical: {
        list: 'flex-col items-center',
        indicator: 'top-0 inset-x-1 h-[--radix-tabs-indicator-size] translate-y-[--radix-tabs-indicator-position]',
        content: 'flex-1'
      }
    }
  }
}
