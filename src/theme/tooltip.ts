export default {
  slots: {
    content: 'flex items-center gap-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow rounded ring ring-gray-200 dark:ring-gray-800 h-6 px-2 py-1 text-xs select-none max-w-48 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=top]:animate-[tooltip-down_200ms_ease-out] data-[state=delayed-open]:data-[side=right]:animate-[tooltip-left_200ms_ease-out] data-[state=delayed-open]:data-[side=left]:animate-[tooltip-right_200ms_ease-out] data-[state=delayed-open]:data-[side=bottom]:animate-[tooltip-up_200ms_ease-out]',
    arrow: 'fill-gray-200 dark:fill-gray-800',
    text: 'truncate',
    // eslint-disable-next-line quotes
    shortcuts: `hidden lg:inline-flex items-center shrink-0 gap-0.5 before:content-['·'] before:mr-0.5`
  }
}