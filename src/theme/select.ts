import { defu } from 'defu'
import input from './input'

export default (config: { colors: string[] }) => {
  return defu({
    slots: {
      arrow: 'fill-gray-200 dark:fill-gray-800',
      content: 'max-h-60 w-[--radix-popper-anchor-width] bg-white dark:bg-gray-900 shadow-lg rounded-md ring ring-gray-200 dark:ring-gray-800 overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]',
      viewport: 'divide-y divide-gray-200 dark:divide-gray-800 scroll-py-1',
      group: 'p-1 isolate',
      empty: 'py-2 text-center text-sm text-gray-500 dark:text-gray-400',
      label: 'p-1.5 text-xs font-semibold text-gray-900 dark:text-white',
      separator: '-mx-1 my-1 h-px bg-gray-200 dark:bg-gray-800',
      item: 'group relative w-full flex items-center gap-1.5 p-1.5 text-sm select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-gray-700 dark:text-gray-200 data-highlighted:text-gray-900 dark:data-highlighted:text-white data-highlighted:before:bg-gray-50 dark:data-highlighted:before:bg-gray-800/50 transition-colors before:transition-colors',
      itemLeadingIcon: 'shrink-0 size-5 text-gray-400 dark:text-gray-500 group-data-highlighted:text-gray-700 dark:group-data-highlighted:text-gray-200 transition-colors',
      itemLeadingAvatar: 'shrink-0',
      itemLeadingChip: 'shrink-0 mx-1.5',
      itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
      itemTrailingSelectedIcon: 'shrink-0 size-5',
      itemLabel: 'truncate'
    }
  }, {
    slots: {
      base: 'relative group rounded-md inline-flex items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75',
      value: 'truncate group-data-placeholder:text-current/50'
    }
  }, input(config))
}
