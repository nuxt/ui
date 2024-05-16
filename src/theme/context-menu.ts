export default {
  slots: {
    content: 'min-w-32 bg-white dark:bg-gray-900 shadow-lg rounded-md ring ring-gray-200 dark:ring-gray-800 divide-y divide-gray-200 dark:divide-gray-800 overflow-y-auto scroll-py-1 data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]',
    group: 'p-1 isolate',
    label: 'w-full flex items-center gap-1.5 p-1.5 text-sm font-semibold text-gray-900 dark:text-white',
    separator: '-mx-1 my-1 h-px bg-gray-200 dark:bg-gray-800',
    item: 'group relative w-full flex items-center gap-1.5 p-1.5 text-sm select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75',
    itemLeadingIcon: 'shrink-0 size-5',
    itemLeadingAvatar: 'shrink-0',
    itemTrailing: 'ms-auto inline-flex',
    itemTrailingIcon: 'shrink-0 size-5',
    itemTrailingKbds: 'hidden lg:inline-flex items-center shrink-0 gap-0.5',
    itemLabel: 'truncate'
  },
  variants: {
    active: {
      true: {
        item: 'text-gray-900 dark:text-white before:bg-gray-100 dark:before:bg-gray-800',
        itemLeadingIcon: 'text-gray-700 dark:text-gray-200'
      },
      false: {
        item: 'text-gray-700 dark:text-gray-200 data-highlighted:text-gray-900 dark:data-highlighted:text-white data-[state=open]:text-gray-900 dark:data-[state=open]:text-white data-highlighted:before:bg-gray-50 dark:data-highlighted:before:bg-gray-800/50 data-[state=open]:before:bg-gray-50 dark:data-[state=open]:before:bg-gray-800/50 transition-colors before:transition-colors',
        itemLeadingIcon: 'text-gray-400 dark:text-gray-500 group-data-highlighted:text-gray-700 dark:group-data-highlighted:text-gray-200 group-data-[state=open]:text-gray-700 dark:group-data-[state=open]:text-gray-200 transition-colors'
      }
    }
  }
}
