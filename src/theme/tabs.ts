export default {
  slots: {
    root: 'flex data-[orientation=horizontal]:flex-col items-center gap-2',
    list: 'relative w-full flex data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 data-[orientation=horizontal]:h-10 p-1 group',
    indicator: 'absolute group-data-[orientation=horizontal]:left-0 group-data-[orientation=vertical]:top-0 group-data-[orientation=horizontal]:inset-y-1 group-data-[orientation=vertical]:inset-x-1 group-data-[orientation=horizontal]:w-[--radix-tabs-indicator-size] group-data-[orientation=vertical]:h-[--radix-tabs-indicator-size] group-data-[orientation=horizontal]:translate-x-[--radix-tabs-indicator-position] group-data-[orientation=vertical]:translate-y-[--radix-tabs-indicator-position] transition-[translate,width] duration-200 bg-white dark:bg-gray-900 rounded-md shadow-sm',
    trigger: 'relative inline-flex items-center justify-center gap-1.5 shrink-0 flex-1 h-8 text-gray-500 data-[state=active]:text-gray-900 dark:text-gray-400 dark:data-[state=active]:text-white px-3 text-sm font-medium rounded-md disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 focus:outline-none',
    content: 'focus:outline-none',
    leadingIcon: 'shrink-0 size-5',
    leadingAvatar: 'shrink-0',
    label: 'truncate'
  }
}
