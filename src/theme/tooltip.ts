export default {
  slots: {
    content: 'flex items-center gap-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow rounded ring ring-gray-200 dark:ring-gray-800 h-6 px-2 py-1 text-xs select-none',
    arrow: 'fill-gray-200 dark:fill-gray-800',
    text: 'truncate',
    kbds: `hidden lg:inline-flex items-center shrink-0 gap-0.5 before:content-['·'] before:mr-0.5`
  },
  variants: {
    side: {
      top: {
        content: 'data-[state=delayed-open]:animate-[slide-in-from-top-and-fade_200ms_ease-out]'
      },
      right: {
        content: 'data-[state=delayed-open]:animate-[slide-in-from-right-and-fade_200ms_ease-out]'
      },
      bottom: {
        content: 'data-[state=delayed-open]:animate-[slide-in-from-bottom-and-fade_200ms_ease-out]'
      },
      left: {
        content: 'data-[state=delayed-open]:animate-[slide-in-from-left-and-fade_200ms_ease-out]'
      }
    }
  }
}
