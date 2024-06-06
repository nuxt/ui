import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex flex-col min-h-0 divide-y divide-gray-200 dark:divide-gray-800',
    input: '[&>input]:h-12',
    close: '',
    content: 'relative overflow-hidden',
    viewport: 'divide-y divide-gray-200 dark:divide-gray-800 scroll-py-1',
    group: 'p-1 isolate',
    empty: 'py-6 text-center text-sm',
    label: 'px-2 py-1.5 text-xs font-semibold text-gray-900 dark:text-white',
    item: ['group relative w-full flex items-center gap-2 px-2 py-1.5 text-sm select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-gray-700 dark:text-gray-200 data-highlighted:text-gray-900 dark:data-highlighted:text-white data-highlighted:before:bg-gray-50 dark:data-highlighted:before:bg-gray-800/50', options.transitions && 'transition-colors before:transition-colors'],
    itemLeadingIcon: ['shrink-0 size-5 text-gray-400 dark:text-gray-500 group-data-highlighted:text-gray-700 dark:group-data-highlighted:text-gray-200', options.transitions && 'transition-colors'],
    itemLeadingAvatar: 'shrink-0',
    itemLeadingChip: 'shrink-0 mx-1.5',
    itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    itemTrailingSelectedIcon: 'shrink-0 size-5',
    itemTrailingHighlightedIcon: 'shrink-0 size-5 text-gray-400 dark:text-gray-500 hidden group-data-highlighted:inline-flex',
    itemTrailingKbds: 'hidden lg:inline-flex items-center shrink-0 gap-0.5',
    itemLabel: 'truncate space-x-1',
    itemLabelBase: '[&>mark]:text-[initial] [&>mark]:bg-[initial]',
    itemLabelPrefix: 'text-gray-400 dark:text-gray-500',
    itemLabelSuffix: 'text-gray-400 dark:text-gray-500 [&>mark]:bg-primary-500 dark:[&>mark]:bg-primary-400 [&>mark]:text-white dark:[&>mark]:text-gray-900'
  }
})
