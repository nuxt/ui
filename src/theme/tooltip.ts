export default {
  slots: {
    content: 'flex items-center gap-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow rounded ring ring-gray-200 dark:ring-gray-800 h-6 px-2 py-1 text-xs select-none data-[state=delayed-open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]',
    arrow: 'fill-gray-200 dark:fill-gray-800',
    text: 'truncate',
    kbds: `hidden lg:inline-flex items-center shrink-0 gap-0.5 before:content-['·'] before:mr-0.5`,
    kbdsSize: 'sm'
  }
}
